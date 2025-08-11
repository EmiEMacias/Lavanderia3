import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useOrder } from '@/OrderContext'; 
import request from '@/services/requests';


export default function EditOrder() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { order, setOrder, resetOrder } = useOrder();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setFetching(true);
    try {
      const { data } = await request.get(`/orders/get-order-detail/${id}`);
      setOrder(data.order);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la orden");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const orderToUpdate = {
        client_id: order.client_id,
        garments: order.garments,
      };

      await request.put(`/orders/update/${id}`, orderToUpdate);
      Alert.alert("Éxito", "Orden actualizada");
      resetOrder();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la orden");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGarment = (index: number) => {
    const updated = [...order.garments];
    updated.splice(index, 1);
    setOrder(prev => ({ ...prev, garments: updated }));
  };

  const handleDeleteService = (gIndex: number, sIndex: number) => {
    const updatedGarments = [...order.garments];
    const copy = { ...updatedGarments[gIndex] };
    copy.services = copy.services.filter((_, i) => i !== sIndex);
    updatedGarments[gIndex] = copy;
    setOrder(prev => ({ ...prev, garments: updatedGarments }));
  };

  if (fetching) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {order.garments.map((garment, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{garment.type} — {garment.description}</Text>
          <Text>Observaciones: {garment.observations}</Text>
          <View style={styles.buttonRow}>
            <Button
              title="Agregar Servicio"
              onPress={() => router.push(`/ServiceView?index=${index}`)}
            />
            <Button
              title="Editar Prenda"
              onPress={() => router.push(`/GarmentsView?editIndex=${index}`)}
            />
            <Button
              title="Eliminar Prenda"
              color="red"
              onPress={() => handleDeleteGarment(index)}
            />
          </View>
          {garment.services.map((service, i) => (
            <View key={i} style={{ marginTop: 5, marginLeft: 10 }}>
              <Text>{service.quantity} × {service.name} = ${service.unitPrice}</Text>
              <View style={{ flexDirection: 'row', gap: 5, marginTop: 5 }}>
                <Button
                  title="Editar Servicio"
                  onPress={() => router.push(`/ServiceView?gIndex=${index}&sIndex=${i}`)}
                />
                <Button
                  title="Eliminar Servicio"
                  color="red"
                  onPress={() => handleDeleteService(index, i)}
                />
              </View>
            </View>
          ))}
        </View>
      ))}
      <Button title={loading ? "Guardando..." : "Guardar Cambios"} onPress={handleSave} disabled={loading} />
      <Button title="Cancelar" color="gray" onPress={() => router.replace('/(tabs)')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 50 },
  card: { marginVertical: 10, padding: 15, backgroundColor: '#eee', borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 16 },
  buttonRow: { marginTop: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }
});