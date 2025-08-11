import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import request from '@/services/requests';

export default function UserDetail() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const router = useRouter();
  console.log("id recibido", id)

  useEffect(() => {
  if (id) {
    request.get(`/users/get-all`)
      .then(res => {
        console.log('Usuarios recibidos:', res.data);
        const user = res.data.find(u => u.id == id);
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      })
      .catch(err => {
        console.error('Error al obtener usuario:', err);
      });
  }
}, [id]);

  const deleteUser = async () => {
    try {
      await request.delete(`/users/delete/${user.id}`);
      Alert.alert('Usuario eliminado');
      router.push('/users');
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando datos del Usuario...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre: {user.name}</Text>
      <Text style={styles.title}>Correo: {user.email}</Text>
      <Text style={styles.title}>Rol de Cliente: {user.rol}</Text>
      <Button title="Eliminar" onPress={deleteUser} />
      <Button title="Actualizar" onPress={() => router.push(`/users/update_user?id=${user.id}`)} />
      <Button title="Cancelar" onPress={() => router.push('/users')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
