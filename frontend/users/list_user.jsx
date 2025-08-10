import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import axios from "axios";
import EditUser from "./EditUser"; 

export default function ListUser({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://127.0.0.1:5000/users/get-all");
      setUsers(data);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al traer los usuarios");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Seguro que deseas eliminar este usuario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`http://127.0.0.1:5000/users/delete/${id}`);
              Alert.alert("Éxito", "Usuario eliminado con éxito");
              getUser();
            } catch (error) {
              Alert.alert("Error", "Ocurrió un error al eliminar el usuario");
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
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.rol}</Text>
      <Text style={styles.cell}>{item.state}</Text>
      <Text style={styles.cell}>{item.created_at}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setCurrentUser(item);
            setShowModalEdit(true);
          }}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de Usuarios</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateUser")}
      >
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <Modal visible={showModalEdit} animationType="slide">
        <View style={styles.modalContent}>
          {currentUser && (
            <EditUser
              close={() => setShowModalEdit(false)}
              reload={getUser}
              user={currentUser}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  createButton: { backgroundColor: "green", padding: 10, borderRadius: 5, marginBottom: 10 },
  editButton: { backgroundColor: "blue", padding: 5, borderRadius: 5, marginRight: 5 },
  deleteButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
  row: { flexDirection: "row", flexWrap: "wrap", padding: 8, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  cell: { flex: 1, fontSize: 14 },
  actions: { flexDirection: "row", marginTop: 5 },
  modalContent: { flex: 1, padding: 16, backgroundColor: "#fff" }
});
