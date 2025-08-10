import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export const EditUser = ({ user, reload, close }) => {
  const [data, setData] = useState(user);

  const submit = async () => {
    try {
      Alert.alert("Actualizando usuario...");
      await axios.put(`http://127.0.0.1:5000/users/update/${user.id}`, data);
      Alert.alert("Usuario actualizado con éxito");
      close(false);
      reload();
    } catch (error) {
      console.log(error);
      Alert.alert("Ocurrió un error al actualizar el usuario");
    }
  };

  const onChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(text) => onChange('name', text)}
      />

      <Text style={styles.label}>Correo:</Text>
      <TextInput
        style={styles.input}
        value={data.email}
        onChangeText={(text) => onChange('email', text)}
      />

      <Text style={styles.label}>Rol:</Text>
      <Picker
        selectedValue={data.rol}
        style={styles.picker}
        onValueChange={(value) => onChange('rol', value)}
      >
        <Picker.Item label="" value="" />
        <Picker.Item label="Administrador" value="administrator" />
        <Picker.Item label="Usuario Normal" value="user" />
      </Picker>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>
          Estado: <Text style={{ color: data.state ? 'green' : 'red' }}>
            {data.state ? "Activo" : "Inactivo"}
          </Text>
        </Text>
        <Switch
          value={data.state}
          onValueChange={(value) => onChange('state', value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginVertical: 15
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: 'bold'
  }
});
