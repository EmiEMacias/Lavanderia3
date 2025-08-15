import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function OrderTable({ orders }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <ScrollView horizontal>
      <View>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.headerCell, styles.cellNumber]}>#</Text>
          <Text style={[styles.headerCell, styles.cellClient]}>Cliente</Text>
          <Text style={[styles.headerCell, styles.cellUser]}>Recibido por</Text>
          <Text style={[styles.headerCell, styles.cellDate]}>Recibido en</Text>
          <Text style={[styles.headerCell, styles.cellState]}>Estado</Text>
          <Text style={[styles.headerCell, styles.cellTotal]}>Total</Text>
        </View>

        {orders.map((order, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.cellNumber]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.cellClient]}>{order.client_name}</Text>
            <Text style={[styles.cell, styles.cellUser]}>{order.user_name}</Text>
            <Text style={[styles.cell, styles.cellDate]}>{formatDate(order.created_at)}</Text>
            <Text style={[styles.cell, styles.cellState]}>{order.state}</Text>
            <Text style={[styles.cell, styles.cellTotal]}>${order.total}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#b3b3ff', // lila suave
    paddingVertical: 10,
  },
  header: {
    backgroundColor: '#e0e0ff', // azul pastel clarito
  },
  cell: {
    textAlign: 'center',
    paddingHorizontal: 10,
    color: '#4e3ca9', // morado oscuro
  },
  headerCell: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: '#5e60ce', // azul-morado fuerte
  },
  cellNumber: {
    width: 30,
  },
  cellClient: {
    width: 150,
  },
  cellUser: {
    width: 120,
  },
  cellDate: {
    width: 150,
  },
  cellState: {
    width: 100,
  },
  cellTotal: {
    width: 80,
  },
});
