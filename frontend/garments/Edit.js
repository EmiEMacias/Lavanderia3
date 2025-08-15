import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function EditGarmentView ({ garment, onClose, onReload })  {
  const [data, setData] = useState({ type: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (garment) {
      setData({
        type: garment.type || '',
        description: garment.description || '',
      });
    }
  }, [garment]);

  const onChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (!data.type.trim() || !data.description.trim()) {
      Alert.alert("⚠️ Campos vacíos", "Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://127.0.0.1:5000/garments/update/${garment.id}`, data);
      Alert.alert("✅ Prenda actualizada con éxito");
      onReload();
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", error.response?.data?.msg || "Ocurrió un error al actualizar la prenda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Prenda</Text>

      <Text style={styles.label}>Tipo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Camisa"
        placeholderTextColor="#b377aa"
        value={data.type}
        onChangeText={(text) => onChange('type', text)}
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Camisa de algodón"
        placeholderTextColor="#b377aa"
        value={data.description}
        onChangeText={(text) => onChange('description', text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#d6336c" style={{ marginTop: 10 }} />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button title="Actualizar" onPress={submit} color="#d6336c" />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="#a83263" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    marginTop: 40, 
    backgroundColor: '#fff0f6',
    flex: 1,
  },
  title: { 
    fontSize: 22, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: 'bold',
    color: '#a83263',
  },
  label: {
    fontWeight: '600',
    color: '#6e1843',
    marginBottom: 6,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#eaa4c7', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 8, 
    color: '#5a1a3b',
    backgroundColor: '#fff5f9',
  },
  buttonContainer: {
    marginTop: 10,
  },
});
