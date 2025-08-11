import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { IGarments, IServiceBackend, IOrderDetail } from '@/Interfaces';
import request from '@/services/requests';


export default function OrderDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<IOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);


  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await request.get(`/orders/get-order-detail/${id}`);
      setOrder(data.order);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener el detalle de la orden");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await request.delete(`/orders/delete/${id}`);
      console.log("Eliminado:", response.data);
      router.replace('/(tabs)');
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order) return;

    const newStatus = order.status.toLowerCase() === 'listo' ? 'recibido' : 'listo';

    setUpdating(true);
    try {
      await request.patch(`/orders/update-status/${id}`, { new_status: newStatus });
      Alert.alert("Éxito", `Estado actualizado a "${newStatus}"`);
      fetchOrder();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la orden.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalle Orden #{order.order_id}</Text>
      <Text>Cliente: {order.client}</Text>
      <Text>Estado: {order.status}</Text>

      {order.garments.map((g, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.garmentTitle}>{g.type} - {g.description}</Text>
          <Text>Observaciones: {g.observations}</Text>
          {g.services.map((s, i) => (
            <View key={i} style={styles.service}>
              <Text>{s.quantity} × {s.name} (${s.price})</Text>
            </View>
          ))}
        </View>
      ))}

      <Button
        title={updating ? "Actualizando..." : `Cambiar estado a "${order.status.toLowerCase() === 'listo' ? 'recibido' : 'listo'}"`}
        onPress={handleUpdateStatus}
        disabled={updating}
      />
      <Button title="Eliminar Orden" color="red" onPress={handleDelete} />
      <Button title="Volver" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#eee',
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
  },
  garmentTitle: {
    fontWeight: 'bold',
  },
  service: {
    marginLeft: 15,
  },
});
