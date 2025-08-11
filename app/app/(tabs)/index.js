import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { OrderTable } from '../../components/OrderTable';
import request from '@/services/requests';


export default function Dashboard(){
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [counting, setCounting] = useState(null);

   useFocusEffect(
    React.useCallback(() => {
      getOrders();
      getPendingOrders();
      getCounting();
    }, [])
  );

  const getOrders = async () => {
    try {
      const { data } = await request.get("/orders/get-orders-dashboard?pagination=1");
      setOrders(data);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener las órdenes");
    }
  };

  const getPendingOrders = async () => {
    try {
      const { data } = await request.get("/orders/get-pending-orders-dashboard?pagination=1");
      setPendingOrders(data);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener las órdenes pendientes");
    }
  };

  const getCounting = async () => {
    try {
      const { data } = await request.get("/orders/get-counting");
      setCounting(data);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener el conteo");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lavandería</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Conteo por unidad</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.col} onPress={() => router.push("/(tabs)/garments/GarmentList")}>
            <Text>Numero Prendas</Text>
            <Text>{counting?.quantity_garments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col} onPress={() => router.push("/(tabs)/services/ListService")}>
            <Text>Numero de Servicio</Text>
            <Text>{counting?.quantity_services}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col} onPress={() => router.push("/clients")}>
            <Text>Numero de Clientes</Text>
            <Text>{counting?.quantity_clients}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.col}onPress={() => router.push("/users")}>
            <Text>Numero de Usuarios</Text>
            <Text>{counting?.quantity_users}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Crear Orden" onPress={() => router.push("/clients/CreateOrder")} />

      <View style={styles.card}>
        <Text style={styles.subtitle}>Listado de órdenes</Text>
        <OrderTable orders={orders} />
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Órdenes Pendientes</Text>
        <OrderTable orders={pendingOrders} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  card: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  col: { alignItems: 'center', flex: 1 },
});


/* import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import request from '../services/requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await request.post('/users/login', { email, password });
      await AsyncStorage.setItem('token', res.data['acces_token']);
      router.push('/clients');
    } catch (err) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput style={styles.input} onChangeText={setEmail} value={email} autoCapitalize="none" />
      <Text>Contraseña:</Text>
      <TextInput style={styles.input} onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => router.push('/register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
}); */