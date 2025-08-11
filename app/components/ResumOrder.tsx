import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { IOrder } from '../Interfaces';

interface Props {
  total: number;
  order: IOrder;
  onCalculate: () => void;
}

const Resumen = ({ total, order, onCalculate }: Props) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleSummary = () => {
    onCalculate();  
    setShowDetails(true);  
  };

  return (
    <View style={styles.summary}>
      <Text style={styles.total}>Total: ${total}</Text>
      <Button title="Resumen" onPress={handleSummary} />

      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.detailsTitle}>Detalle de la orden:</Text>
          {order.garments.map((garment, index) => (
            <View key={index} style={styles.garment}>
              <Text style={styles.garmentTitle}>
                {garment.type} — {garment.description || 'Sin descripción'}
              </Text>
              {garment.services.map((service, sIdx) => {
                return (
                  <Text key={sIdx} style={styles.serviceText}>
                    • {service.quantity} × {service.name} = ${service.unitPrice} 
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    marginVertical: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  garment: {
    marginBottom: 10,
  },
  garmentTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  serviceText: {
    paddingLeft: 10,
    color: '#333',
  },
});

export default Resumen;
