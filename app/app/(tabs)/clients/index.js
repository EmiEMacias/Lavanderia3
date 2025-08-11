import { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import request from '../../../services/requests';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const router = useRouter();

  const fetchClients = async () => {
    const res = await request.get('/clients/search', {
      params: {
        filter: 'name',
        parameter: '',
      }
    });
    setClients(res.data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Crear cliente" onPress={() => router.push('/clients/create')} />
      <Button title="Regresar" color="gray" onPress={() => router.push('/(tabs)')} />
      <FlatList
        data={clients}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/clients/view?id=${item.phone_number}`)}>
            <Text style={styles.title}>{item.name} - {item.phone_number}</Text>
          </TouchableOpacity>
        )}
      />
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
