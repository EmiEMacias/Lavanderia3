import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function EditGarmentView({ garment, onClose, onReload }) {
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
        placeholderTextColor="#b3b3ff"
        value={data.type}
        onChangeText={(text) => onChange('type', text)}
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Camisa de algodón"
        placeholderTextColor="#b3b3ff"
        value={data.description}
        onChangeText={(text) => onChange('description', text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#5e60ce" style={{ marginTop: 20 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
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
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: 'bold',
    color: '#5e60ce',
  },
  label: {
    fontWeight: '600',
    color: '#4e3ca9',
    marginBottom: 6,
    fontSize: 16,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#a3a0ff', 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 10, 
    color: '#4e3ca9',
    backgroundColor: '#f0f0ff',
  },
  button: {
    backgroundColor: '#5e60ce',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 15,
    shadowColor: '#4e3ca9',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 6,
  },
  cancelButton: {
    backgroundColor: '#6c63ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
