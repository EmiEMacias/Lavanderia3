import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, Modal, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import EditClient from "./edit_client"; // Lo adaptaremos también a RN

export default function ListClient() {
  const [clients, setClients] = useState([]);
  const [parameter, setParameter] = useState("");
  const navigation = useNavigation();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    try {
      Alert.alert("Cargando", "Obteniendo clientes...");
      const { data } = await axios.get("http://127.0.0.1:5000/clients/search");
      setClients(data);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al traer los clientes");
      console.log(error);
    }
  };

  const deleteClient = async (id) => {
    Alert.alert("Confirmar", "¿Seguro que deseas eliminar el cliente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await axios.delete(`http://127.0.0.1:5000/clients/delete/${id}`);
            Alert.alert("Éxito", "Cliente eliminado");
            getClients();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el cliente");
            console.log(error);
          }
        },
      },
    ]);
  };

  const search_by = async (filter) => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:5000/clients/search?filter=${filter}&parameter=${parameter}`
      );
      setClients(data);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al buscar");
      console.log(error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemRow}>
      <Text>{index + 1}. {item.name} - {item.phone_number}</Text>
      <Text>{item.address}</Text>
      <Text>{item.created_at}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setCurrentClient(item);
            setShowModalEdit(true);
          }}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteClient(item.id)}
        >
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de clientes</Text>
      <Button title="Crear cliente" onPress={() => navigation.navigate("CreateClient")} />

      <Text>Búsqueda rápida:</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe aquí..."
        onChangeText={(text) => setParameter(text)}
      />
      <View style={styles.row}>
        <Button title="Teléfono" onPress={() => search_by("phone")} />
        <Button title="Nombre" onPress={() => search_by("name")} />
        <Button title="Reset" onPress={getClients} />
      </View>

      <FlatList
        data={clients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal visible={showModalEdit} animationType="slide">
        <View style={styles.modalContainer}>
          <Button title="Cerrar" onPress={() => setShowModalEdit(false)} />
          {currentClient && (
            <EditClient close={setShowModalEdit} reload={getClients} client={currentClient} />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-around", marginVertical: 5 },
  itemRow: { borderBottomWidth: 1, padding: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10, borderRadius: 5 },
  editBtn: { backgroundColor: "blue", padding: 5, borderRadius: 5, marginHorizontal: 5 },
  deleteBtn: { backgroundColor: "red", padding: 5, borderRadius: 5, marginHorizontal: 5 },
  btnText: { color: "#fff" },
  modalContainer: { flex: 1, padding: 20 },
});
