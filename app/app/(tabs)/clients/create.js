import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import request from '../../../services/requests';
import { useRouter } from 'expo-router';

export default function CreateClient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    try {
      await request.post('/clients/create', {
        name,
        phone_number: phone,
        address
      });
      Alert.alert('Cliente creado');
      router.push('/clients');
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear el cliente');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nombre:</Text>
      <TextInput style={styles.input} onChangeText={setName} value={name} />
      <Text>Teléfono:</Text>
      <TextInput style={styles.input} onChangeText={setPhone} value={phone} keyboardType="phone-pad" />
      <Text>Dirección:</Text>
      <TextInput style={styles.input} onChangeText={setAddress} value={address} />
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
