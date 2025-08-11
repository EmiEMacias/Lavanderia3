import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import request from '@/services/requests';
import { useRouter } from 'expo-router';

export default function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    try {
      await request.post('/users/register', {
        name,
        email,
        password,
        rol
      });
      Alert.alert('Usuario creado con éxito');
      router.push('/users'); 
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nombre:</Text>
      <TextInput style={styles.input} onChangeText={setName} value={name} />
      <Text>Email:</Text>
      <TextInput style={styles.input} onChangeText={setEmail} value={email} keyboardType="email-address" />
      <Text>Contraseña:</Text>
      <TextInput style={styles.input} onChangeText={setPassword} value={password} secureTextEntry />
      <Text>Rol:</Text>
      <TextInput style={styles.input} onChangeText={setRol} value={rol} />
      <Button title="Crear" onPress={handleCreate} />
      <Button title="Cancelar" onPress ={() => router.push('/clients')}/>

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
