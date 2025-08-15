import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

// Simula tus constantes
const constants = {
  services: [
    { name: 'Lavado', quantity: 1, unitPrice: 10 },
    { name: 'Planchado', quantity: 1, unitPrice: 15 },
    { name: 'Tintorería', quantity: 1, unitPrice: 20 },
    { name: 'Especial', quantity: 1, unitPrice: 50 },

  ],
  garments: [    "Camisa",
    "Pantalon",
    "Prenda Interior",
    "Blusa",
    "Vestido",
    "Chamarra",
    "Traje",
    "Sueter",
    "Falda",
    "Saco",
    "Playera"],
};

const defaultGarment = {
  type: 'Camisa',
  description: '',
  observations: '',
  services: [{ ...constants.services[0] }],
};

export default function CreateOrder  ()  {
  const [order, setOrder] = useState({
    client_id: 1,
    user_id: 1,
    state: 'recibido',
    total: 0,
    estimated_delivery_date: '',
    pagado: false,
    garments: [defaultGarment],
  });

  const [total, setTotal] = useState(0);

  // Recalcula el total cada vez que cambien las prendas o servicios
  useEffect(() => {
    calculateTotal();
  }, [order.garments]);

  const calculateTotal = () => {
    let subTotal = 0;
    order.garments.forEach((garment) => {
      garment.services.forEach((service) => {
        subTotal += service.quantity * service.unitPrice;
      });
    });
    setTotal(subTotal);
    setOrder((prev) => ({ ...prev, total: subTotal }));
  };

  const addGarment = () => {
    setOrder((prev) => ({
      ...prev,
      garments: [...prev.garments, { ...defaultGarment }],
    }));
  };

  const deleteGarment = (index) => {
    setOrder((prev) => {
      const newGarments = prev.garments.filter((_, i) => i !== index);
      return { ...prev, garments: newGarments };
    });
  };

  const addServiceToGarment = (ig) => {
    setOrder((prev) => {
      const garmentsCopy = [...prev.garments];
      garmentsCopy[ig].services.push({ ...constants.services[0] });
      return { ...prev, garments: garmentsCopy };
    });
  };

  const deleteServiceToGarment = (ig, is) => {
    setOrder((prev) => {
      const garmentsCopy = [...prev.garments];
      garmentsCopy[ig].services = garmentsCopy[ig].services.filter(
        (_, i) => i !== is
      );
      return { ...prev, garments: garmentsCopy };
    });
  };

  const onChangeGarment = (key, value, ig) => {
    setOrder((prev) => {
      const garmentsCopy = [...prev.garments];
      garmentsCopy[ig][key] = value;
      return { ...prev, garments: garmentsCopy };
    });
  };

  const onChangeServiceFields = (key, value, ig, is) => {
    setOrder((prev) => {
      const garmentsCopy = [...prev.garments];
      garmentsCopy[ig].services[is][key] =
        key === 'name' ? value : parseFloat(value) || 0;
      return { ...prev, garments: garmentsCopy };
    });
  };

  const onChangeDate = (date) => {
    setOrder((prev) => ({ ...prev, estimated_delivery_date: date }));
  };

  const onSubmit = () => {
    Alert.alert('Creando orden...', JSON.stringify(order, null, 2));
    // Aquí pondrías tu fetch o axios para guardar la orden
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Creación de Orden</Text>

      <TouchableOpacity style={styles.button} onPress={addGarment}>
        <Text style={styles.buttonText}>Agregar Prenda</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Fecha Estimada de Entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={order.estimated_delivery_date}
        onChangeText={onChangeDate}
      />

      {order.garments.map((garment, i) => (
        <View key={i} style={styles.garmentContainer}>
          {i > 0 && (
            <TouchableOpacity
              style={styles.deleteGarmentBtn}
              onPress={() => deleteGarment(i)}
            >
              <Text style={{ color: 'white' }}>Eliminar Prenda</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.subtitle}>Prenda #{i + 1}</Text>

          <Text>Tipo de prenda:</Text>
          <ScrollView horizontal>
            {constants.garments.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.garmentType,
                  garment.type === g && styles.garmentTypeSelected,
                ]}
                onPress={() => onChangeGarment('type', g, i)}
              >
                <Text
                  style={
                    garment.type === g
                      ? styles.garmentTypeTextSelected
                      : styles.garmentTypeText
                  }
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={garment.description}
            onChangeText={(text) => onChangeGarment('description', text, i)}
            placeholder="Descripción"
          />

          <Text>Observaciones:</Text>
          <TextInput
            style={styles.input}
            value={garment.observations}
            onChangeText={(text) => onChangeGarment('observations', text, i)}
            placeholder="Observaciones"
          />

          <Text style={{ marginTop: 10 }}>Servicios:</Text>
          {garment.services.map((service, is) => (
            <View key={is} style={styles.serviceContainer}>
              {is > 0 && (
                <TouchableOpacity
                  style={styles.deleteServiceBtn}
                  onPress={() => deleteServiceToGarment(i, is)}
                >
                  <Text style={{ color: 'white' }}>X</Text>
                </TouchableOpacity>
              )}

              <Text>Nombre:</Text>
              <ScrollView horizontal>
                {constants.services.map((s) => (
                  <TouchableOpacity
                    key={s.name}
                    style={[
                      styles.serviceNameBtn,
                      service.name === s.name && styles.serviceNameSelected,
                    ]}
                    onPress={() => onChangeServiceFields('name', s.name, i, is)}
                  >
                    <Text
                      style={
                        service.name === s.name
                          ? styles.serviceNameTextSelected
                          : styles.serviceNameText
                      }
                    >
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text>Cantidad:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={service.quantity.toString()}
                onChangeText={(text) =>
                  onChangeServiceFields('quantity', text, i, is)
                }
              />

              <Text>Precio:</Text>
              {['Lavado', 'Planchado'].includes(service.name) ? (
                <Text>{service.unitPrice}</Text>
              ) : (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={service.unitPrice.toString()}
                  onChangeText={(text) =>
                    onChangeServiceFields('unitPrice', text, i, is)
                  }
                />
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addServiceBtn}
            onPress={() => addServiceToGarment(i)}
          >
            <Text style={{ color: 'white' }}>Agregar Servicio</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.total}>Total: {total}</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={onSubmit}>
        <Text style={styles.saveBtnText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff0f6', flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#d6336c',
  },
  button: {
    backgroundColor: '#e83e8c', // rosa fuerte
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  label: { marginBottom: 5, color: '#a52a63' },
  input: {
    borderWidth: 1,
    borderColor: '#d6336c',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
    backgroundColor: '#fff0f6',
    color: '#6f0421',
  },
  garmentContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f3a6c4',
    borderRadius: 10,
    backgroundColor: '#ffe6f0',
  },
  deleteGarmentBtn: {
    backgroundColor: '#d6336c',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#9f224e' },
  garmentType: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#c77d9b',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ffe6f0',
  },
  garmentTypeSelected: {
    backgroundColor: '#d6336c',
  },
  garmentTypeText: { color: '#9f224e' },
  garmentTypeTextSelected: { color: 'white' },
  serviceContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f0a6c2',
    borderRadius: 10,
    backgroundColor: '#ffe6f0',
  },
  deleteServiceBtn: {
    backgroundColor: '#d6336c',
    padding: 4,
    borderRadius: 20,
    alignSelf: 'flex-end',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceNameBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#c77d9b',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ffe6f0',
  },
  serviceNameSelected: {
    backgroundColor: '#e83e8c',
  },
  serviceNameText: { color: '#9f224e' },
  serviceNameTextSelected: { color: 'white' },
  addServiceBtn: {
    backgroundColor: '#e83e8c',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
    color: '#d6336c',
  },
  saveBtn: {
    backgroundColor: '#d6336c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
