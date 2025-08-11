import React, {useState} from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrder } from '@/OrderContext';
import Resumen from '@/components/ResumOrder';
import request from '@/services/requests';
import axios from 'axios';


const CreateOrder = () => {
  const { order, setOrder, resetOrder } = useOrder();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleCalculate = () => {
    const total = order.garments.reduce((sum, g) =>
      sum + g.services.reduce((sSum, s) => sSum + s.quantity * s.unitPrice, 0), 0);
    setOrder(prev => ({ ...prev, total }));
  };

  const handleCreateOrder = async () => {
    console.log("order que se enviará:", order);
    console.log("handleCreateOrder triggered");
    console.log("order.client_id", order.client_id);
     setLoading(true);
     const orderToSend = {
    ...order,
    estimated_delivery_date: "2025-08-10"
  };
    if (!order.client_id) {
      Alert.alert("Error", "Debes seleccionar un cliente antes de crear la orden.");
      return;
    }

    if (order.garments.length === 0) {
      Alert.alert("Error", "Debes agregar al menos una prenda.");
      return;
    }

    try {
      setLoading(true);
      handleCalculate();

      const { data } = await request.post('/orders/create', orderToSend, {
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert("Éxito", `Orden creada con ID ${data.orderId}`);
      resetOrder();
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "No se pudo crear la orden. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <ScrollView contentContainerStyle={styles.container}>
    {order.garments.map((garment, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.title}>{garment.type} — {garment.description}</Text>
        <Text>Observaciones: {garment.observations}</Text>
        <View style={styles.buttonRow}>
          <View style={styles.inlineButtons}>
            <Button
              title="Agregar Servicio"
              onPress={() => router.push(`/ServiceView?index=${index}`)}
            />
            <Button
              title="Editar Prenda"
              onPress={() => router.push(`/GarmentsView?editIndex=${index}`)}
            />
          </View>
          <View style={{ marginTop: 5 }}>
            <Button
              title="Eliminar Prenda"
              color="red"
              onPress={() => handleDeleteGarment(index)}
            />
          </View>
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
    <Button title="Agregar Prenda" onPress={() => router.push('/GarmentsView')} />
    <Resumen total={order.total} order={order} onCalculate={handleCalculate} />
    <Button title="Crear" onPress={handleCreateOrder} />
    <Button title="Regresar" color="gray" onPress ={() => router.push('/(tabs)')} />

  </ScrollView>
);
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
  },
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonRow: {
    marginTop: 10,
    marginBottom: 10,
  },

  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default CreateOrder;
