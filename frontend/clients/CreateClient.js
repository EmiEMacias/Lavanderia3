import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';

export const CreateClientView = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone_number, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleCreate = async () => {
    if (!name || !phone_number || !address) {
      Alert.alert("❌ Todos los campos son obligatorios");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:5000/clients/create", {
        name,
        phone_number,
        address
      });
      Alert.alert("✅ Cliente creado con éxito");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error al crear cliente");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Cliente</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre completo" placeholderTextColor="#a7b1ff" />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={phone_number}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Número telefónico"
          placeholderTextColor="#a7b1ff"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Dirección completa"
          placeholderTextColor="#a7b1ff"
        />

        <TouchableOpacity style={styles.btn} onPress={handleCreate}>
          <Text style={styles.btnText}>Guardar Cliente</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef2ff',
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b0082',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    color: '#3c1e70',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#a78bfa',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#f5f3ff',
    color: '#312e81',
  },
  btn: {
    backgroundColor: '#6d28d9',
    paddingVertical: 15,
    marginTop: 30,
    borderRadius: 12,
    shadowColor: '#4c1d95',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CreateClientView;
