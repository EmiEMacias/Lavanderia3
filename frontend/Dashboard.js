import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import OrderTable from './components/orderTable';
import SubMenu from './components/SubMenu';

export default function Dashboard() {
  const navigation = useNavigation();
  const [order, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [counting, setCounting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      await Promise.all([
        getOrders(),
        getPendingOrders(),
        getCounting()
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    const { data } = await axios.get("http://127.0.0.1:5000/order/get-order-dashboard?pagination=1");
    setOrders(data);
  };

  const getPendingOrders = async () => {
    const { data } = await axios.get("http://127.0.0.1:5000/order/get-pending-order-dashboard?pagination=1");
    setPendingOrders(data);
  };

  const getCounting = async () => {
    const { data } = await axios.get("http://127.0.0.1:5000/order/get-counting");
    setCounting(data);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando información...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SubMenu navigation={navigation} />

      <Text style={styles.title}>Lavandería</Text>

      {/* Conteo por unidad */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Conteo por unidad</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Prendas")}>
            <Text>Número Prendas</Text>
            <Text>{counting?.quantity_garments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Servicios")}>
            <Text>Número de Servicio</Text>
            <Text>{counting?.quantity_services}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Clientes")}>
            <Text>Número de Clientes</Text>
            <Text>{counting?.quantity_clients}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Usuarios")}>
            <Text>Número de Usuarios</Text>
            <Text>{counting?.quantity_users}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón crear orden */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateOrder")}>
        <Text style={styles.buttonText}>Crear Orden</Text>
      </TouchableOpacity>

      {/* Listados */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Listado de órdenes</Text>
        <OrderTable orders={order} />
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Órdenes pendientes</Text>
        <OrderTable orders={pendingOrders} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  col: { flex: 1, alignItems: 'center', padding: 10, backgroundColor: '#eee', margin: 5, borderRadius: 8 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }
});
