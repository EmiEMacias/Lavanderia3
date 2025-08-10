import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import constants from "../Contants";
import SubMenu from "../components/SubMenu"; // Ajusta la ruta según la ubicación

const { services, garments } = constants;

export default function CreateOrder({ navigation }) {
  const defaultGarment = {
    type: garments[0],
    description: "",
    observations: "",
    services: [
      {
        name: services[0].name,
        quantity: 1,
        unitPrice: services[0].unitPrice || 0,
      },
    ],
  };

  const [order, setOrder] = useState({
    client_id: 1,
    user_id: 1,
    state: "recibido",
    total: 0,
    estimated_delivery_date: "",
    pagado: false,
    garments: [defaultGarment],
  });

  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    let subTotal = 0;
    for (const garment of order.garments) {
      for (const service of garment.services) {
        subTotal += (Number(service.quantity) || 0) * (Number(service.unitPrice) || 0);
      }
    }
    setTotal(subTotal);
    setOrder({ ...order, total: subTotal });
  };

  const addGarment = () => {
    setOrder({ ...order, garments: [...order.garments, defaultGarment] });
  };

  const onChangeGarment = (key, value, ig) => {
    const updatedGarments = [...order.garments];
    updatedGarments[ig][key] = value;
    setOrder({ ...order, garments: updatedGarments });
  };

  const onChangeServiceFields = (key, value, ig, is) => {
    const updatedGarments = [...order.garments];
    updatedGarments[ig].services[is][key] =
      key === "name" ? value : Number(value);
    setOrder({ ...order, garments: updatedGarments });
    calculateTotal();
  };

  const addServiceToGarment = (ig) => {
    const updatedGarments = [...order.garments];
    updatedGarments[ig].services.push({
      name: services[0].name,
      quantity: 1,
      unitPrice: services[0].unitPrice || 0,
    });
    setOrder({ ...order, garments: updatedGarments });
  };

  const removeGarment = (ig) => {
    const updatedGarments = order.garments.filter((_, idx) => idx !== ig);
    setOrder({ ...order, garments: updatedGarments });
  };

  const removeServiceFromGarment = (ig, is) => {
    const updatedGarments = [...order.garments];
    updatedGarments[ig].services = updatedGarments[ig].services.filter(
      (_, idx) => idx !== is
    );
    setOrder({ ...order, garments: updatedGarments });
    calculateTotal();
  };

  const onSubmit = () => {
    if (order.garments.length === 0) {
      Alert.alert("Error", "Debes agregar al menos una prenda.");
      return;
    }
    Alert.alert("Orden creada con éxito", JSON.stringify(order, null, 2));
  };

  return (
    <View style={styles.container}>
      <SubMenu navigation={navigation} />
      <ScrollView>
        <Text style={styles.title}>Creación de Orden</Text>
        <TouchableOpacity style={styles.addButton} onPress={addGarment}>
          <Text style={styles.addButtonText}>+ Agregar Prenda</Text>
        </TouchableOpacity>

        {order.garments.map((garment, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.subtitle}>Prenda #{i + 1}</Text>
              {order.garments.length > 1 && (
                <TouchableOpacity onPress={() => removeGarment(i)}>
                  <Text style={styles.removeText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.label}>Tipo de prenda:</Text>
            <Picker
              selectedValue={garment.type}
              onValueChange={(val) => onChangeGarment("type", val, i)}
              style={styles.picker}
            >
              {garments.map((g, idx) => (
                <Picker.Item label={g} value={g} key={idx} />
              ))}
            </Picker>

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
              style={styles.input}
              value={garment.description}
              onChangeText={(val) => onChangeGarment("description", val, i)}
              placeholder="Ej: Camisa blanca"
            />

            <Text style={styles.label}>Observaciones:</Text>
            <TextInput
              style={styles.input}
              value={garment.observations}
              onChangeText={(val) => onChangeGarment("observations", val, i)}
              placeholder="Observaciones adicionales"
            />

            <Text style={styles.sectionTitle}>Servicios</Text>
            {garment.services.map((service, is) => (
              <View key={is} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.label}>Servicio:</Text>
                  {garment.services.length > 1 && (
                    <TouchableOpacity onPress={() => removeServiceFromGarment(i, is)}>
                      <Text style={styles.removeText}>Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Picker
                  selectedValue={service.name}
                  onValueChange={(val) => onChangeServiceFields("name", val, i, is)}
                  style={styles.picker}
                >
                  {services.map((s, idx) => (
                    <Picker.Item label={s.name} value={s.name} key={idx} />
                  ))}
                </Picker>
                <Text style={styles.label}>Cantidad:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(service.quantity)}
                  onChangeText={(val) => onChangeServiceFields("quantity", val, i, is)}
                  placeholder="Ej: 2"
                />
                <Text style={styles.label}>Precio unitario:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(service.unitPrice)}
                  onChangeText={(val) => onChangeServiceFields("unitPrice", val, i, is)}
                  placeholder="Ej: 50"
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addServiceButton}
              onPress={() => addServiceToGarment(i)}
            >
              <Text style={styles.addButtonText}>+ Agregar Servicio</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
        <Button title="Guardar Orden" onPress={onSubmit} color="#2e86de" />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f7f9fa" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 18, color: "#2e86de" },
  subtitle: { fontSize: 18, fontWeight: "600", color: "#34495e" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 12, color: "#2e86de" },
  label: { fontSize: 15, marginTop: 8, color: "#636e72" },
  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 12,
    backgroundColor: "#fff",
    borderColor: "#dfe6e9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceCard: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 7,
    backgroundColor: "#f1f2f6",
    borderColor: "#dfe6e9",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginVertical: 5,
    borderColor: "#b2bec3",
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#b2bec3",
    borderRadius: 6,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#2e86de",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addServiceButton: {
    backgroundColor: "#00b894",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  removeText: {
    color: "#d63031",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#636e72",
    marginRight: 8,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00b894",
  },
});
