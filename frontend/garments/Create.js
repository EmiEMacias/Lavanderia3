import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function CreateGarmentView  ()  {
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
      Alert.alert("Éxito", "Prenda creada con éxito");
      setData({ type: '', description: '' }); // Limpia el formulario
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.msg || "Ocurrió un error al crear la prenda"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de Prendas</Text>

      <Text>Tipo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo de prenda"
        value={data.type}
        onChangeText={(text) => onChange('type', text)}
      />

      <Text>Descripción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={data.description}
        onChangeText={(text) => onChange('description', text)}
      />


      {loading ? (
        <ActivityIndicator size="large" color="#a83263" style={{ marginTop: 10 }} />
      ) : (
        <Button title="Crear" onPress={submit} color="#a83263" />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    backgroundColor: '#fff0f6',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#a83263',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eaa4c7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff5f9',
    color: '#5a1a3b',
  },
});
