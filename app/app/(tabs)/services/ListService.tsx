import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, Button, FlatList, Alert, Modal, StyleSheet, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { IServiceBackend } from '@/Interfaces';
import EditService from './EditService';
import { useFocusEffect } from '@react-navigation/native';
import request from '@/services/requests';



export default function ListService  ()  {
  const [services, setServices] = useState<IServiceBackend[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentService, setCurrentService] = useState<IServiceBackend | null>(null);
  const router = useRouter();

  useFocusEffect(
  useCallback(() => {
    getServices();
  }, [])
);


  useEffect(() => {
    if (!showModalEdit) {
      getServices();
    }
  }, [showModalEdit]);

  const getServices = async () => {
    try {
      setLoading(true);
      const { data } = await request.get('/services/get-all');
      setServices(data.services);
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al traer los servicios');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
  try {
    setLoading(true);
    await request.delete(`/services/delete/${id}`);
    getServices(); 
    Alert.alert("Éxito", "Servicio eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar:", error);
    Alert.alert("Error", "No se pudo eliminar el servicio");
  } finally {
    setLoading(false);
  }
};

  const renderItem = ({ item, index }: { item: IServiceBackend; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={[styles.cell, styles.name]}>{item.name}</Text>
      <Text style={[styles.cell, styles.description]}>{item.description}</Text>
      <Text style={styles.cell}>${item.price}</Text>
      <View style={[styles.cell, styles.actions]}>
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
      <View style={styles.createButtonContainer}>
        <Button title="Crear servicio" onPress={() => router.push('/(tabs)/services/CreateService')} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View style={[styles.row, styles.header]}>
              <Text style={styles.cell}>#</Text>
              <Text style={[styles.cell, styles.name]}>Nombre</Text>
              <Text style={[styles.cell, styles.description]}>Descripción</Text>
              <Text style={styles.cell}>Precio</Text>
              <Text style={[styles.cell, styles.actions]}>Opciones</Text>
            </View>
          )}
        />
      )}

      <Modal
        visible={showModalEdit}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModalEdit(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar servicio</Text>
            {currentService && (
              <EditService 
                close={() => setShowModalEdit(false)} 
                reload={getServices} 
                service={currentService} 
              />
            )}
            <Button title="Cerrar" onPress={() => setShowModalEdit(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  createButtonContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ddd',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  name: {
    flex: 2,
  },
  description: {
    flex: 3,
  },
  actions: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
