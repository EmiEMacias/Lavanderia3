import { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import request from '@/services/requests';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const router = useRouter();

    const fetchUsers = async () => {
        const res = await request.get('/users/get-all', {
            params: {
                filter: 'name',
                parameter: '',
            }
        });
        setUsers(res.data);
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Button title="Crear Usuario" onPress={() => router.push('/users/create_user')} />
            <Button title="Regresar" color="gray" onPress={() => router.push('/(tabs)')} />

            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/users/view_user?id=${item.id}`)}>
                        <Text style={styles.title}>{item.name} - {item.rol}</Text>
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
