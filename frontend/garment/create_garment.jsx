import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Card, TextInput, Title } from "react-native-paper";
import axios from "axios";

export const Create = () => {
  const [data, setData] = useState({ name: "", description: "" });

  const submit = async () => {
    try {
      Alert.alert("Guardando prenda...");
      await axios.post("http://127.0.0.1:5000/garments/create", data);
      Alert.alert("Prenda creada con éxito");
      setData({ name: "", description: "" }); // limpiar inputs
    } catch (error) {
      console.log(error);
      Alert.alert("Ocurrió un error al cargar las prendas");
    }
  };

  const onChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Creación de prendas</Title>

          <TextInput
            label="Tipo"
            value={data.name}
            onChangeText={(text) => onChange("name", text)}
            style={styles.input}
          />

          <TextInput
            label="Descripción"
            value={data.description}
            onChangeText={(text) => onChange("description", text)}
            style={styles.input}
          />

          <Button mode="contained" onPress={submit} style={styles.button}>
            Crear
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
