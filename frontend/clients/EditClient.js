import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

export const EditClient = ({ client, reload, close }) => {
  const [data, setData] = useState({
    name: client.name || '',
    phone_number: client.phone_number || '',
    address: client.address || ''
  });
  const [loading, setLoading] = useState(false);

  const onChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!data.name.trim() || !data.phone_number.trim() || !data.address.trim()) {
      Alert.alert("⚠️ Campos vacíos", "Por favor completa todos los campos.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(`http://127.0.0.1:5000/clients/update/${client.id}`, data);
      Alert.alert("✅ Cliente actualizado con éxito");
      close(false);
      reload();
    } catch (error) {
      console.log(error);
      Alert.alert("❌ Error", error.response?.data?.msg || "Ocurrió un error al actualizar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Cliente</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(text) => onChange('name', text)}
        placeholder="Nombre completo"
        placeholderTextColor="#b377aa"
      />

      <Text style={styles.label}>Número telefónico:</Text>
      <TextInput
        style={styles.input}
        value={data.phone_number}
        onChangeText={(text) => onChange('phone_number', text)}
        keyboardType="phone-pad"
        placeholder="Ej. 555-123-4567"
        placeholderTextColor="#b377aa"
      />

      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        style={styles.input}
        value={data.address}
        onChangeText={(text) => onChange('address', text)}
        placeholder="Dirección completa"
        placeholderTextColor="#b377aa"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#d6336c" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>Actualizar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff0f6'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#a83263',
  },
  label: {
    fontWeight: '600',
    color: '#6e1843',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eaa4c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff5f9',
    color: '#5a1a3b',
  },
  btn: {
    backgroundColor: '#d6336c',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#a83263',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 6,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default EditClient;
