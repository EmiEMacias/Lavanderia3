import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'  // <-- Importa el hook

export default function CreateService  ()  {
  const navigation = useNavigation()  // <-- Inicializa navegación
  const [data, setData] = useState({ name: '', description: '', price: '' })

  const submit = async () => {
    // Validar campos
    if (!data.name.trim() || !data.description.trim() || !data.price.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }
    if (isNaN(Number(data.price))) {
      Alert.alert('Error', 'El precio debe ser un número válido')
      return
    }

    try {
      Alert.alert('Guardando servicio...')
      await axios.post('http://127.0.0.1:5000/services/create', {
        name: data.name,
        description: data.description,
        price: Number(data.price),
      })
      Alert.alert('Éxito', 'Servicio creado con éxito')
      setData({ name: '', description: '', price: '' })
      navigation.navigate('ListService')  // <-- Navega después de crear
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Ocurrió un error al crear el servicio')
    }
  }

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de servicios</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={text => onChange('name', text)}
        placeholder="Nombre del servicio"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={data.description}
        onChangeText={text => onChange('description', text)}
        placeholder="Descripción"
      />

      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        value={data.price}
        onChangeText={text => onChange('price', text)}
        placeholder="Precio"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Crear</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.navigate('ListService')}
      >
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E0E0FF', // azul muy suave
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E60CE', // morado
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#4E3CA9', // morado más oscuro
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#7C7CFF', // azul morado
    backgroundColor: '#DDE0FF', // azul claro
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: '#002B75', // azul oscuro
  },
  button: {
    backgroundColor: '#5E60CE', // morado principal
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#4E3CA9', // morado secundario
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
