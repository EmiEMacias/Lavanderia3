import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { IGarments } from '../Interfaces';

/**
 * @typedef {Object} Props
 * @property {IGarments} garment
 * @property {() => Promise<void>} reload
 * @property {(value: boolean) => void} close
 */

export const Edit = ({ garment, reload, close }) => {
  const [data, setData] = useState({
    type: garment.type,
    description: garment.description,
  });

  const submit = async () => {
    try {
      Alert.alert("Actualizando prenda...");
      await axios.put(`http://127.0.0.1:5000/garments/update/${garment.id}`, data);
      Alert.alert("Éxito", "Prenda actualizada con éxito", [
        { text: "OK", onPress: () => { close(false); reload(); } }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error al actualizar la prenda");
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
        value={data.type}
        onChangeText={(text) => onChange('type', text)}
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={data.description}
        onChangeText={(text) => onChange('description', text)}
      />

      <Button title="Actualizar" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
});
