import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import request from '@/services/requests';



export default function CreateService() {
    const router = useRouter();
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
    });

    const submit = async () => {
        if (!data.name || !data.price) {
            Alert.alert('Error', 'Por favor completa los campos requeridos');
            return;
        }
        try {
            Alert.alert('Guardando servicio...');
            await request.post('/services/create', {
                name: data.name,
                description: data.description,
                price: Number(data.price),
            });
            Alert.alert('Éxito', 'Servicio creado con éxito');
            setData({ name: '', description: '', price: '' });
            router.replace("/(tabs)/services/ListService");
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Ocurrió un error al crear el servicio');
        }
    };

    const onChange = (field: keyof typeof data, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Creación de servicios</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput
                        style={styles.input}
                        value={data.name}
                        onChangeText={text => onChange('name', text)}
                        placeholder="Nombre del servicio"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Descripción:</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={data.description}
                        onChangeText={text => onChange('description', text)}
                        placeholder="Descripción"
                        multiline
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Precio:</Text>
                    <TextInput
                        style={styles.input}
                        value={data.price}
                        onChangeText={text => onChange('price', text)}
                        placeholder="Precio"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Crear" onPress={submit} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontWeight: '600',
        marginBottom: 6,
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