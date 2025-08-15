import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import axios from 'axios'

export default function CreateUser  ({ navigation })  {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    rol: '',
    state: false,
  })

  const submit = async () => {
    if (!data.name.trim() || !data.email.trim() || !data.password.trim() || !data.rol.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    try {
      Alert.alert('Guardando usuario...')
      await axios.post('http://127.0.0.1:5000/users/register', data)
      Alert.alert('Éxito', 'Usuario creado con éxito', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('UsersList'),
        },
      ])
      setData({
        name: '',
        email: '',
        password: '',
        rol: '',
        state: false,
      })
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Ocurrió un error al guardar el usuario')
    }
  }

  const onChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de usuarios</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(text) => onChange('name', text)}
        placeholder="Nombre completo"
        placeholderTextColor="#b43b68"
      />

      <Text style={styles.label}>Correo:</Text>
      <TextInput
        style={styles.input}
        value={data.email}
        onChangeText={(text) => onChange('email', text)}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#b43b68"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        value={data.password}
        onChangeText={(text) => onChange('password', text)}
        placeholder="Contraseña segura"
        secureTextEntry
        placeholderTextColor="#b43b68"
      />

      <Text style={styles.label}>Rol:</Text>
      <View style={styles.rolContainer}>
        <TouchableOpacity
          style={[
            styles.rolOption,
            data.rol === 'administrator' && styles.rolOptionSelected,
          ]}
          onPress={() => onChange('rol', 'administrator')}
        >
          <Text
            style={[
              styles.rolText,
              data.rol === 'administrator' && styles.rolTextSelected,
            ]}
          >
            Administrador
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.rolOption,
            data.rol === 'user' && styles.rolOptionSelected,
          ]}
          onPress={() => onChange('rol', 'user')}
        >
          <Text
            style={[
              styles.rolText,
              data.rol === 'user' && styles.rolTextSelected,
            ]}
          >
            Usuario Normal
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>
          Estado:{" "}
          <Text style={{ color: data.state ? 'green' : 'red' }}>
            {data.state ? 'Activo' : 'Inactivo'}
          </Text>
        </Text>
        <Switch
          value={data.state}
          onValueChange={(value) => onChange('state', value)}
          thumbColor={data.state ? '#d6336c' : '#ccc'}
          trackColor={{ false: '#eee', true: '#f783ac' }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0FF', // azul suave
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5E60CE', // morado principal
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#4E3CA9', // morado oscuro
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#7C7CFF', // azul-morado
    backgroundColor: '#DDE0FF', // azul claro
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#3B3CA9', // azul oscuro
    marginBottom: 20,
  },
  rolContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rolOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#7C7CFF',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  rolOptionSelected: {
    backgroundColor: '#5E60CE',
  },
  rolText: {
    color: '#4E3CA9',
    fontWeight: '600',
  },
  rolTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#5E60CE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#5E60CE',
    fontWeight: '600',
    fontSize: 16,
  },
});

