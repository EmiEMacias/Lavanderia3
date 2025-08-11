import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import request from '@/services/requests';

export default function UpdateUser() {
  const { id } = useLocalSearchParams(); 
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      request.get('/users/get-all')
        .then((res) => {
          const foundUser = res.data.find(u => u.id == id);
          if (foundUser) {
            setUser(foundUser);
            setName(foundUser.name);
            setEmail(foundUser.email);
            setRol(foundUser.rol);
          } else {
            setUser(null);
          }
        })
        .catch(err => {
          console.error('Error al obtener usuario:', err);
        });
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      await request.put(`/users/update/${user.id}`, {
        name,
        email,
        rol,
      });
      Alert.alert('Usuario actualizado con éxito');
      router.push('/users');
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el usuario');
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
      <Text>Nombre:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Correo:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Text>Rol:</Text>
      <TextInput style={styles.input} value={rol} onChangeText={setRol} />
      <Button title="Actualizar" onPress={handleUpdate} />
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
