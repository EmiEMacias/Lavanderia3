import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function CreateClient() {
  const [data, setData] = useState({ name: '', phone_number: '', address: '' });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const submit = async () => {
    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:5000/clients/create", data);
      Alert.alert("Éxito", "Cliente creado con éxito", [
        { text: "OK", onPress: () => navigation.navigate("Clients") }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un error al crear el cliente");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de clientes</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={value => onChange('name', value)}
      />

      <Text style={styles.label}>Número telefónico:</Text>
      <TextInput
        style={styles.input}
        value={data.phone_number}
        keyboardType="phone-pad"
        onChangeText={value => onChange('phone_number', value)}
      />

      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        style={styles.input}
        value={data.address}
        onChangeText={value => onChange('address', value)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
