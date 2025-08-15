import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { EditUser } from './EditUser';

export default function ListUser  ({ navigation })  {
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
      const { data } = await axios.get('http://127.0.0.1:5000/users/get-all');
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al traer los usuarios');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/users/delete/${id}`);
      Alert.alert("✅", response.data.msg || "Usuario eliminado correctamente");
      getUser(); // refresca la lista
    } catch (error) {
      Alert.alert(
        "❌ Error",
        `No se pudo eliminar el usuario: ${
          error.response?.data?.msg || error.message || "Error desconocido"
        }`
      );
    }
  };

  const renderUser = ({ item, index }) => (
    <View style={styles.userRow}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={[styles.cell, styles.name]}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.rol}</Text>
      <Text style={styles.cell}>{item.state}</Text>
      <Text style={styles.cell}>{item.created_at}</Text>
      <View style={[styles.cell, styles.options]}>
        <TouchableOpacity
          style={[styles.btn, styles.editBtn]}
          onPress={() => {
            setCurrentUser(item);
            setShowModalEdit(true);
          }}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de usuarios</Text>
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate('CreateUser')}
      >
        <Text style={styles.createBtnText}>Crear usuario</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#ff69b4" />
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={[styles.userRow, styles.headerRow]}>
              <Text style={styles.headerCell}>#</Text>
              <Text style={[styles.headerCell, styles.name]}>Nombre</Text>
              <Text style={styles.headerCell}>Correo</Text>
              <Text style={styles.headerCell}>Rol</Text>
              <Text style={styles.headerCell}>Estado</Text>
              <Text style={styles.headerCell}>Fecha creación</Text>
              <Text style={[styles.headerCell, styles.options]}>Opciones</Text>
            </View>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderUser}
            />
          </View>
        </ScrollView>
      )}

      <Modal
        visible={showModalEdit}
        animationType="slide"
        onRequestClose={() => {
          setShowModalEdit(false);
          getUser();
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar usuario</Text>
          {currentUser && (
            <EditUser
              close={(val) => {
                setShowModalEdit(val);
                if (val === false) getUser();
              }}
              reload={getUser}
              user={currentUser}
            />
          )}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setShowModalEdit(false);
              getUser();
            }}
          >
            <Text style={styles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0E0FF', // azul claro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5E60CE', // morado principal
    textAlign: 'center',
    marginBottom: 15,
  },
  createBtn: {
    backgroundColor: '#7C7CFF', // azul-morado
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
  },
  createBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userRow: {
    flexDirection: 'row',
    backgroundColor: '#DDE0FF', // azul suave
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#B1B4FF', // azul pastel
  },
  cell: {
    flex: 1,
    color: '#3B3CA9', // azul oscuro
    fontSize: 14,
    paddingHorizontal: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#5E60CE', // morado principal
    fontSize: 15,
    paddingHorizontal: 4,
  },
  name: {
    flex: 2,
  },
  options: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editBtn: {
    backgroundColor: '#7C7CFF', // azul-morado
  },
  deleteBtn: {
    backgroundColor: '#5E60CE', // morado oscuro
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#E0E0FF',
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E60CE',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#7C7CFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
