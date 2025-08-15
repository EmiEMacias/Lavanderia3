import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import EditClient from './EditClient';

export default function ListClient({ navigation }) {
  const [clients, setClients] = useState([]);
  const [parameter, setParameter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/clients/search');
      setClients(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/clients/delete/${id}`);
      setClients(clients.filter((client) => client.id !== id));
      Alert.alert("✅", response.data.msg || "Cliente eliminado correctamente");
    } catch (error) {
      Alert.alert(
        "❌ Error",
        `No se pudo eliminar el cliente: ${error.response?.data?.msg || error.message || "Error desconocido"}`
      );
    }
  };

  const searchClients = async (filter) => {
    if (!parameter.trim()) {
      Alert.alert('Aviso', 'Por favor ingresa un parámetro para buscar');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/clients/search?filter=${filter}&parameter=${parameter}`
      );
      setClients(response.data);
    } catch {
      Alert.alert('Error', 'Error al buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de Clientes</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateClient')}
      >
        <Text style={styles.buttonText}>Crear Cliente</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Buscar clientes..."
        placeholderTextColor="#b3b3ff"
        value={parameter}
        onChangeText={setParameter}
      />

      <View style={styles.searchButtons}>
        <TouchableOpacity style={styles.searchButton} onPress={() => searchClients('phone')}>
          <Text style={styles.buttonText}>Teléfono</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={() => searchClients('name')}>
          <Text style={styles.buttonText}>Nombre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={fetchClients}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5e60ce" />
      ) : (
        <ScrollView style={styles.listContainer}>
          {clients.map((client, index) => (
            <View key={client.id} style={styles.clientRow}>
              <Text style={styles.clientIndex}>{index + 1}.</Text>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientPhone}>{client.phone_number}</Text>
                <Text style={styles.clientAddress}>{client.address}</Text>
                <Text style={styles.clientDate}>{client.created_at}</Text>
              </View>
              <View style={styles.clientActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setCurrentClient(client);
                    setShowModalEdit(true);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteClient(client.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showModalEdit} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModalEdit(false)}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
          {currentClient && (
            <EditClient
              close={setShowModalEdit}
              reload={fetchClients}
              client={currentClient}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#4e3ca9', textAlign: 'center' },
  createButton: { backgroundColor: '#5e60ce', padding: 12, borderRadius: 8, marginBottom: 16 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#8d84f2', borderRadius: 8, padding: 10, marginBottom: 16, backgroundColor: 'white', color: '#2d2675' },
  searchButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  searchButton: { backgroundColor: '#5e60ce', padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  resetButton: { backgroundColor: '#9b59b6', padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  listContainer: { flex: 1 },
  clientRow: { flexDirection: 'row', padding: 10, backgroundColor: '#ffffff', marginBottom: 10, borderRadius: 10, alignItems: 'center', elevation: 3 },
  clientIndex: { fontWeight: 'bold', color: '#5e60ce', marginRight: 8, width: 24 },
  clientInfo: { flex: 1 },
  clientName: { fontWeight: 'bold', fontSize: 16, color: '#4e3ca9' },
  clientPhone: { color: '#6c63ff' },
  clientAddress: { color: '#6c63ff' },
  clientDate: { color: '#b3b3ff', fontSize: 12 },
  clientActions: { flexDirection: 'row' },
  editButton: { backgroundColor: '#5e60ce', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginRight: 6 },
  deleteButton: { backgroundColor: '#9b59b6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  modalContent: { flex: 1, padding: 20, backgroundColor: '#f0f4ff' },
  closeButton: { backgroundColor: '#4e3ca9', padding: 10, borderRadius: 8, marginBottom: 10 },
});
