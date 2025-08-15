import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import OrderTable from './components/OrderTable';

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
    const { data } = await axios.get("http://127.0.0.1:5000/orders/get-orders-dashboard?pagination=1");
    setOrders(data);
  };

  const getPendingOrders = async () => {
    const { data } = await axios.get("http://127.0.0.1:5000/orders/get-pending-orders-dashboard?pagination=1");
    setPendingOrders(data);
  };

  const getCounting = async () => {
    const { data } = await axios.get("http://127.0.0.1:5000/orders/get-counting");
    setCounting(data);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ color: '#6a0dad', fontSize: 16 }}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Lavandería</Text>

      {/* Menú de navegación */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("ListClient")}>
          <Text style={styles.menuText}>Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("ListGarments")}>
          <Text style={styles.menuText}>Prendas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("ListService")}>
          <Text style={styles.menuText}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("ListUser")}>
          <Text style={styles.menuText}>Usuarios</Text>
        </TouchableOpacity>
      </View>

      {/* Conteo por unidad */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Conteo por unidad</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Prendas")}>
            <Text style={styles.colTitle}>Número Prendas</Text>
            <Text style={styles.colNumber}>{counting?.quantity_garments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Servicios")}>
            <Text style={styles.colTitle}>Número de Servicio</Text>
            <Text style={styles.colNumber}>{counting?.quantity_services}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Clientes")}>
            <Text style={styles.colTitle}>Número de Clientes</Text>
            <Text style={styles.colNumber}>{counting?.quantity_clients}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col} onPress={() => navigation.navigate("Usuarios")}>
            <Text style={styles.colTitle}>Número de Usuarios</Text>
            <Text style={styles.colNumber}>{counting?.quantity_users}</Text>
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
  container: { 
    padding: 15, 
    backgroundColor: '#f4f4fb' 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#4b0082', 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 12, 
    color: '#6a0dad' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    marginBottom: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 5, 
    elevation: 4 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  col: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#e6e6fa', 
    margin: 5, 
    borderRadius: 8 
  },
  colTitle: { 
    fontSize: 14, 
    color: '#4b0082', 
    fontWeight: '600' 
  },
  colNumber: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#6a0dad', 
    marginTop: 5 
  },
  button: { 
    backgroundColor: '#4b0082', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 100, 
    backgroundColor: '#f4f4fb' 
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: '#6a0dad',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 5,
    elevation: 3
  },
  menuText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
