import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native'
import axios from 'axios'
import { EditService } from './EditService'

export default function ListService  ({ navigation })  {
  const [services, setServices] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentService, setCurrentService] = useState(null)

  useEffect(() => {
    getServices()
  }, [])

  const getServices = async () => {
    try {
      // Aquí puedes poner un spinner o loading si quieres
      const { data } = await axios.get('http://127.0.0.1:5000/services/get-all')
      setServices(data.services)
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Ocurrió un error al cargar los servicios')
    }
  }

  const deleteService = (id) => {
    if (!id) {
      Alert.alert('Error', 'Id inválido para eliminar')
      return
    }

    Alert.alert(
      'Eliminar servicio',
      '¿Seguro que quieres eliminar este servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              await axios.delete(`http://127.0.0.1:5000/services/delete/${id}`)
              Alert.alert('Éxito', 'Servicio eliminado con éxito')
              getServices() // Refresca la lista
            } catch (error) {
              console.log(error)
              Alert.alert('Error', 'Ocurrió un error al eliminar el servicio')
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  const openEditModal = (service) => {
    setCurrentService(service)
    setModalVisible(true)
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemIndex}>{index + 1}.</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => openEditModal(item)}
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
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Listado de servicios</Text>

      <FlatList
        data={services}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateService')}
      >
        <Text style={styles.createButtonText}>Crear servicio</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          {currentService && (
            <EditService
              service={currentService}
              close={setModalVisible}
              reload={getServices}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0FF', // azul muy suave
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    color: '#5E60CE', // morado principal
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#5E60CE', // morado
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#DDE0FF', // azul claro
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIndex: {
    fontWeight: 'bold',
    color: '#3B3CA9', // azul más oscuro
    marginRight: 10,
    fontSize: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#4E3CA9', // morado oscuro
  },
  itemDesc: {
    color: '#3B3CA9',
    marginVertical: 3,
  },
  itemPrice: {
    color: '#306CF8', // azul fuerte
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#7C7CFF', // azul-morado
  },
  deleteButton: {
    backgroundColor: '#5E60CE', // morado
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
