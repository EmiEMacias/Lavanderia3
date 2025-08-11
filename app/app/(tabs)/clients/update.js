import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import request from '../../../services/requests';

export default function UpdateClient() {
  const { id } = useLocalSearchParams(); // Leer el query param ?id=
  const [client, setClient] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      request.get('/clients/search', {
        params: {
          filter: 'phone',
          parameter: id,
        }
      }).then((res) => {
        if (res.data.length > 0) {
          const c = res.data[0];
          setClient(c);
          setName(c.name);
          setPhone(c.phone_number);
          setAddress(c.address);
        } else {
          setClient(null);
        }
      }).catch(err => {
        console.error('Error al obtener cliente:', err);
      });
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      await request.put(`/clients/update/${client.id}`, {
        name,
        phone_number: phone,
        address,
      });
      Alert.alert('Cliente actualizado con éxito');
      router.push('/clients');
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar el cliente');
    }
  };

  if (!client) {
    return (
      <View style={styles.container}>
        <Text>Cargando datos del cliente...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Nombre:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Teléfono:</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      <Text>Dirección:</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      <Button title="Actualizar" onPress={handleUpdate} />
      <Button title="Cancelar" onPress={() => router.push('/clients')} />
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
