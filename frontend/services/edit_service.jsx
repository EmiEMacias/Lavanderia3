import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export const EditService = ({ service, reload, close }) => {
  const [data, setData] = useState({});

  const submit = async () => {
    try {
      Alert.alert("Actualizando servicio...");
      await axios.put(`http://127.0.0.1:5000/services/update/${service.id}`, data);
      Alert.alert("Éxito", "Servicio actualizado con éxito", [
        { text: "OK", onPress: () => { close(false); reload(); } }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un error al actualizar el servicio");
    }
  };

  const onChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo:</Text>
      <TextInput
        style={styles.input}
        defaultValue={service.name}
        onChangeText={(text) => onChange('name', text)}
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        defaultValue={service.description}
        onChangeText={(text) => onChange('description', text)}
      />

      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        defaultValue={String(service.price)}
        onChangeText={(text) => onChange('price', text)}
      />

      <Button title="Actualizar" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 5,
    borderRadius: 5
  }
});
