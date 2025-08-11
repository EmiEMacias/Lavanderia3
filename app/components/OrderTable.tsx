import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IOrderTable } from '@/Interfaces';
import { useRouter } from 'expo-router';

interface Props {
    orders: IOrderTable[];
}

export const OrderTable: React.FC<Props> = ({ orders }) => {
    const router = useRouter();

    return (
        <View style={styles.table}>
            <View style={[styles.row, styles.header]}>
                <Text style={styles.cell}>#</Text>
                <Text style={styles.cell}>Cliente</Text>
                <Text style={styles.cell}>Recibido por</Text>
                <Text style={styles.cell}>Recibido en</Text>
                <Text style={styles.cell}>Estado</Text>
                <Text style={styles.cell}>Total</Text>
            </View>
            <FlatList
                data={orders}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.row}
                         onPress={() => router.push({ pathname: '/(tabs)/orders/OrdrerView', params: { id: String(item.id) } })} 
                    >
                        <Text style={styles.cell}>{index + 1}</Text>
                        <Text style={styles.cell}>{item.client_name}</Text>
                        <Text style={styles.cell}>{item.user_name}</Text>
                        <Text style={styles.cell}>{item.created_at}</Text>
                        <Text style={styles.cell}>{item.state}</Text>
                        <Text style={styles.cell}>{item.total}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
    },
    header: {
        backgroundColor: '#f1f1f1',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 5,
        fontSize: 12,
    },
});
