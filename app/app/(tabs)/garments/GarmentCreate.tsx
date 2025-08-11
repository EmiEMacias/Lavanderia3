import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import request from '../../../services/requests';



export default function Create  ()  {
  const [data, setData] = useState({});
      const router = useRouter();
  

  const submit = async () => {
    try {
      Alert.alert("Guardando prenda", "Por favor espera...");
      await request.post("/garments/create", data);
      Alert.alert("Éxito", "Prenda creada con éxito");
      router.replace("/(tabs)/garments/GarmentList");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un error al cargar la prenda");
    }
  };

  const onChange = (name: string, value: string) => {
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Creación de prendas</Text>

        <Text style={styles.label}>Tipo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Tipo de prenda"
          onChangeText={(text) => onChange("name", text)}
        />

        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          onChangeText={(text) => onChange("description", text)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Crear" onPress={submit} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flexGrow: 1
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 3
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16
  },
  buttonContainer: {
    marginTop: 10
  }
});
