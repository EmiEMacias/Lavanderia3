import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { IGarments } from '@/Interfaces';
import { useRouter } from "expo-router";
import request from '@/services/requests';

interface Props {
  garment?: IGarments; // ahora es opcional
  reload: () => Promise<void>;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Edit({ garment, reload, close }: Props) {
  const router = useRouter();

  const [data, setData] = useState({
    type: garment?.type || '',
    description: garment?.description || '',
  });
  const [loading, setLoading] = useState(false);

  // Si garment llega después, actualizamos el estado
  useEffect(() => {
    if (garment) {
      setData({
        type: garment.type || '',
        description: garment.description || '',
      });
    }
  }, [garment]);

  const submit = async () => {
    if (!data.type) {
      Alert.alert('Error', 'El tipo de prenda es requerido');
      return;
    }

    try {
      setLoading(true);
      await request.put(`/garments/update/${garment?.id}`, {
        type: data.type,
        description: data.description,
      });

      await reload();
      router.replace("/(tabs)/garments/GarmentList");
      Alert.alert('Éxito', 'Prenda actualizada con éxito', [
        {
          text: 'OK',
          onPress: () => close(false),
        }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al actualizar la prenda');
      await reload();
    } finally {
      setLoading(false);
    }
  };

  const onChange = (name: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Si no hay garment todavía, mostramos cargando
  if (!garment) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando prenda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo:</Text>
      <TextInput
        style={styles.input}
        value={data.type}
        onChangeText={(value) => onChange('type', value)}
        placeholder="Tipo de prenda"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={data.description}
        onChangeText={(value) => onChange('description', value)}
        placeholder="Descripción"
      />

      <Button title={loading ? "Actualizando..." : "Actualizar"} onPress={submit} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
