import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import EditService from './EditService'; // Componente que tú tengas en RN

export default function ListService() {
  const [services, setServices] = useState([]);
  const navigation = useNavigation();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://127.0.0.1:5000/services/get-all");
      setServices(data.services);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al traer los servicios");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que quieres eliminar este servicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí", onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`http://127.0.0.1:5000/services/delete/${id}`);
              Alert.alert("Éxito", "Servicio eliminado con éxito");
              getServices();
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Ocurrió un error al eliminar el servicio");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.description}</Text>
      <Text style={styles.cell}>${item.price}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => {
            setCurrentService(item);
            setShowModalEdit(true);
          }}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteService(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de servicios</Text>
      <TouchableOpacity
        style={[styles.button, styles.createButton]}
        onPress={() => navigation.navigate("CreateService")}
      >
        <Text style={styles.buttonText}>Crear servicio</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <Modal visible={showModalEdit} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => setShowModalEdit(false)}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
          {currentService && (
            <EditService
              close={setShowModalEdit}
              reload={getServices}
              service={currentService}
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
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 8 },
  cell: { width: "20%", fontSize: 14 },
  actions: { flexDirection: "row", width: "40%", justifyContent: "space-around" },
  button: { padding: 8, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  editButton: { backgroundColor: "orange" },
  deleteButton: { backgroundColor: "red" },
  createButton: { backgroundColor: "green", alignSelf: "flex-end", marginBottom: 10 }
});
