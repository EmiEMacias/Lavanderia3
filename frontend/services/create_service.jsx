import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export const CreateService = () => {
  const [data, setData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const submit = async () => {
    try {
      Alert.alert("Guardando servicio...");
      await axios.post("http://127.0.0.1:5000/services/create", data);
      Alert.alert("Servicio creado con éxito");
      setData({ name: '', description: '', price: '' }); // Limpiar formulario
    } catch (error) {
      console.log(error);
      Alert.alert("Ocurrió un error al cargar las prendas");
    }
  };

  const onChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de servicios</Text>

      <Text>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(value) => onChange('name', value)}
        placeholder="Ingrese nombre"
      />

      <Text>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={data.description}
        onChangeText={(value) => onChange('description', value)}
        placeholder="Ingrese descripción"
      />

      <Text>Precio:</Text>
      <TextInput
        style={styles.input}
        value={data.price}
        onChangeText={(value) => onChange('price', value)}
        placeholder="Ingrese precio"
        keyboardType="numeric"
      />

      <Button title="Crear" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  }
});
