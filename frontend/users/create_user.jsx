import React, { useState } from "react";
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function CreateUser({ navigation }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    rol: "",
    state: false
  });

  const submit = async () => {
    try {
      Alert.alert("Guardando usuario...");
      await axios.post("http://127.0.0.1:5000/users/register", data);
      Alert.alert("Usuario creado con éxito");
      navigation.navigate("Users");
    } catch (error) {
      console.log(error);
      Alert.alert("Ocurrió un error al guardar el usuario");
    }
  };

  const onChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creación de usuarios</Text>

      <Text>Nombre:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChange("name", text)}
      />

      <Text>Correo:</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        onChangeText={(text) => onChange("email", text)}
      />

      <Text>Contraseña:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => onChange("password", text)}
      />

      <Text>Rol:</Text>
      <Picker
        selectedValue={data.rol}
        onValueChange={(value) => onChange("rol", value)}
        style={styles.input}
      >
        <Picker.Item label="Selecciona un rol" value="" />
        <Picker.Item label="Administrador" value="administrator" />
        <Picker.Item label="Usuario Normal" value="user" />
      </Picker>

      <View style={styles.switchContainer}>
        <Text>
          Estado: <Text style={{ color: data.state ? "green" : "red" }}>
            {data.state ? "Activo" : "Inactivo"}
          </Text>
        </Text>
        <Switch
          value={data.state}
          onValueChange={(value) => onChange("state", value)}
        />
      </View>

      <Button title="Guardar" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20
  }
});
