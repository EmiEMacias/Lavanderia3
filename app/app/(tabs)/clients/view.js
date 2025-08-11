import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import request from '../../../services/requests';

export default function ClientDetail() {
  const { id } = useLocalSearchParams();
  const [client, setClient] = useState(null);
  const router = useRouter();
  console.log("id recibido", id)

  useEffect(() => {
    if (id) {
      request.get(`/clients/search`, {
        params: {
          filter: "phone",
          parameter: id
        }
      })
        .then(res => {
          console.log('Cliente recibido:', res.data);
          if (res.data.length > 0) {
            setClient(res.data[0]); 
          } else {
            setClient(null); 
          }
        })
        .catch(err => {
          console.error('Error al obtener cliente:', err);
        });
    }
  }, [id]);

  const deleteClient = async () => {
    await request.delete(`/clients/delete/${client.id}`);
    Alert.alert('Cliente eliminado');
    router.push('/clients');
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
      <Text style={styles.title}>Nombre: {client.name}</Text>
      <Text style={styles.title}>Teléfono: {client.phone_number}</Text>
      <Text style={styles.title}>Dirección: {client.address}</Text>
      <Button title="Eliminar" onPress={deleteClient} />
      <Button title="Actualizar" onPress={() => router.push(`/clients/update?id=${client.phone_number}`)} />
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
