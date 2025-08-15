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
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre completo" placeholderTextColor="#b377aa" />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={phone_number}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Número telefónico"
          placeholderTextColor="#b377aa"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Dirección completa"
          placeholderTextColor="#b377aa"
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
    backgroundColor: '#fff0f6',
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d6336c',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    color: '#a83263',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eaa4c7',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#fff5f9',
    color: '#5a1a3b',
  },
  btn: {
    backgroundColor: '#e83e8c',
    paddingVertical: 15,
    marginTop: 30,
    borderRadius: 12,
    shadowColor: '#d6336c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
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
