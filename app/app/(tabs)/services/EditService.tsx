import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { IServiceBackend } from '@/Interfaces';
import { useRouter } from 'expo-router';
import request from '@/services/requests';

interface Props {
  service?: IServiceBackend; // ahora es opcional para evitar crash
  reload: () => Promise<void>;
  close: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditService({ service, reload, close }: Props) {
  const [data, setData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price?.toString() || '',
  });

  const router = useRouter();

  // Si el servicio llega después (por props async), actualizamos el estado
  useEffect(() => {
    if (service) {
      setData({
        name: service.name || '',
        description: service.description || '',
        price: service.price?.toString() || '',
      });
    }
  }, [service]);

  const submit = async () => {
    if (!data.name || !data.price) {
      Alert.alert('Error', 'Por favor completa los campos requeridos');
      return;
    }

    try {
      await request.put(`/services/update/${service?.id}`, {
        name: data.name,
        description: data.description,
        price: Number(data.price),
      });

      reload();
      router.push("/(tabs)/services/ListService");
      Alert.alert('Éxito', 'Servicio actualizado con éxito', [{
        text: 'OK',
        onPress: () => close(false),
      }]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el servicio');
      reload();
    }
  };

  const onChange = (field: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Si todavía no hay datos de servicio, mostramos un loader
  if (!service) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando servicio...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo:</Text>
          <TextInput
            style={styles.input}
            value={data.name}
            onChangeText={(text) => onChange('name', text)}
            placeholder="Nombre del servicio"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={data.description}
            onChangeText={(text) => onChange('description', text)}
            placeholder="Descripción"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio:</Text>
          <TextInput
            style={styles.input}
            value={data.price}
            onChangeText={(text) => onChange('price', text)}
            placeholder="Precio"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Actualizar" onPress={submit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
