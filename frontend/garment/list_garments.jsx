import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Edit from './edit_garment'; // Adaptar también este a React Native

export default function List() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentGarment, setCurrentGarment] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    getGarments();
  }, []);

  const getGarments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://127.0.0.1:5000/garments/get-all");
      setGarments(data.garments);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al traer las prendas");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGarment = async (id) => {
    Alert.alert(
      "Confirmar",
      "¿Seguro que quieres eliminar la prenda?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`http://127.0.0.1:5000/garments/delete/${id}`);
              Alert.alert("Éxito", "Prenda eliminada correctamente");
              getGarments();
            } catch (error) {
              Alert.alert("Error", "Ocurrió un error al eliminar la prenda");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>{item.description}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setCurrentGarment(item);
            setShowModalEdit(true);
          }}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteGarment(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de prendas</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateGarment")}
      >
        <Text style={styles.buttonText}>Crear prenda</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={garments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <Modal
        visible={showModalEdit}
        animationType="slide"
        onRequestClose={() => setShowModalEdit(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModalEdit(false)}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
          {currentGarment && (
            <Edit
              close={setShowModalEdit}
              reload={getGarments}
              garment={currentGarment}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 10 },
  cell: { flex: 1, textAlign: "center" },
  actions: { flexDirection: "row", justifyContent: "space-around", flex: 1 },
  editButton: { backgroundColor: "#007bff", padding: 8, borderRadius: 5 },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 5 },
  createButton: { backgroundColor: "green", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalContent: { flex: 1, padding: 20 },
  closeButton: { backgroundColor: "#555", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 20 },
});
