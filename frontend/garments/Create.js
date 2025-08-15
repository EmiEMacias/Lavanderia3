import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function CreateGarmentView() {
  const [data, setData] = useState({ type: '', description: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!data.type.trim() || !data.description.trim()) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:5000/garments/create", data);
      Alert.alert("✅ Éxito", "Prenda creada con éxito");
      setData({ type: '', description: '' });
    } catch (error) {
      console.error(error);
      Alert.alert(
        "❌ Error",
        error.response?.data?.msg || "Ocurrió un error al crear la prenda"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de Prendas</Text>

      <Text style={styles.label}>Tipo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo de prenda"
        placeholderTextColor="#b3b3ff"
        value={data.type}
        onChangeText={(text) => onChange('type', text)}
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#b3b3ff"
        value={data.description}
        onChangeText={(text) => onChange('description', text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#5e60ce" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Crear Prenda</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 40,
    backgroundColor: '#e0e0ff',
    flex: 1,
  },
  title: {
    fontSize: 26,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#5e60ce',
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#4e3ca9',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#a3a0ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f0f0ff',
    color: '#4e3ca9',
  },
  button: {
    backgroundColor: '#5e60ce',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#4e3ca9',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
