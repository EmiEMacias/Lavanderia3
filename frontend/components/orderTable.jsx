import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function OrderTable({ orders }) {
  const renderHeader = () => (
    <View style={[styles.row, styles.header]}>
      <Text style={styles.cell}>#</Text>
      <Text style={styles.cell}>Cliente: </Text>
      <Text style={styles.cell}>Recibido por: </Text>
      <Text style={styles.cell}>Recibido en: </Text>
      <Text style={styles.cell}>Estado: </Text>
      <Text style={styles.cell}>Total: </Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.client_name}</Text>
      <Text style={styles.cell}>{item.user_name}</Text>
      <Text style={styles.cell}>{item.created_at}</Text>
      <Text style={styles.cell}>{item.state}</Text>
      <Text style={styles.cell}>{item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    backgroundColor: '#F8E2E3',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#F2CACB',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 4,
  },
});
