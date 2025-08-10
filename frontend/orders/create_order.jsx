import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import constants from "../Contants";

const { services, garments } = constants;

export default function CreateOrder() {
  const defaultGarment = {
    type: "Camisa",
    description: "",
    observations: "",
    services: [services[0]],
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
        subTotal += service.quantity * service.unitPrice;
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
    updatedGarments[ig].services[is][key] = key === "name" ? value : parseFloat(value);
    setOrder({ ...order, garments: updatedGarments });
  };

  const addServiceToGarment = (ig) => {
    const updatedGarments = [...order.garments];
    updatedGarments[ig].services.push(services[0]);
    setOrder({ ...order, garments: updatedGarments });
  };

  const onSubmit = () => {
    Alert.alert("Orden creada con éxito", JSON.stringify(order, null, 2));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Creación de Orden</Text>
      <Button title="Agregar Prenda" onPress={addGarment} />

      {order.garments.map((garment, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.subtitle}>Prenda #{i + 1}</Text>
          <Text>Tipo de prenda:</Text>
          <Picker
            selectedValue={garment.type}
            onValueChange={(val) => onChangeGarment("type", val, i)}
          >
            {garments.map((g, idx) => (
              <Picker.Item label={g} value={g} key={idx} />
            ))}
          </Picker>

          <Text>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={garment.description}
            onChangeText={(val) => onChangeGarment("description", val, i)}
          />

          <Text>Observaciones:</Text>
          <TextInput
            style={styles.input}
            value={garment.observations}
            onChangeText={(val) => onChangeGarment("observations", val, i)}
          />

          <Text style={styles.subtitle}>Servicios:</Text>
          {garment.services.map((service, is) => (
            <View key={is} style={styles.serviceCard}>
              <Picker
                selectedValue={service.name}
                onValueChange={(val) => onChangeServiceFields("name", val, i, is)}
              >
                {services.map((s, idx) => (
                  <Picker.Item label={s.name} value={s.name} key={idx} />
                ))}
              </Picker>
              <Text>Cantidad:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(service.quantity)}
                onChangeText={(val) => onChangeServiceFields("quantity", val, i, is)}
                onBlur={calculateTotal}
              />
              <Text>Precio:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(service.unitPrice)}
                onChangeText={(val) => onChangeServiceFields("unitPrice", val, i, is)}
                onBlur={calculateTotal}
              />
            </View>
          ))}
          <Button title="Agregar Servicio" onPress={() => addServiceToGarment(i)} />
        </View>
      ))}

      <Text style={styles.total}>Total: {total}</Text>
      <Button title="Guardar" onPress={onSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  card: { padding: 12, borderWidth: 1, borderRadius: 8, marginVertical: 10 },
  serviceCard: { padding: 8, borderWidth: 1, borderRadius: 8, marginVertical: 5 },
  input: { borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 5 },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
});
