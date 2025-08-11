import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import axios from "axios";
import Edit from "./GarmentEdit"
import { IGarments } from "@/Interfaces";
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import request from '@/services/requests';




export default function List ()  {
    const router = useRouter();
  const [garments, setGarments] = useState<IGarments[]>([]);
    const [loading, setLoading] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentGarment, setCurrentGarment] = useState<IGarments | null>(null);

  useFocusEffect(
    useCallback(() => {
      getGarments();
    }, [])
  );

  useEffect(() => {
      if (!showModalEdit) {
        getGarments();
      }
    }, [showModalEdit]);

  const getGarments = async () => {
    try {
      Alert.alert("Cargando prendas...");
      const { data } = await request.get("/garments/get-all");
      setGarments(data.garments || []);
    } catch (error) {
      Alert.alert("Ocurrió un error al traer las prendas");
      console.log(error);
      setGarments([])
    }
  };

  const deleteGarment = async (id: number | undefined) => {
            try {
        setLoading(true);

              await request.delete(`/garments/delete/${id}`);
              getGarments();
            } catch (error) {
              console.log(error);
              Alert.alert("Ocurrió un error al eliminar la prenda");
            }
          };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listado de prendas</Text>

      <TouchableOpacity
        style={styles.buttonCreate}
        onPress={() => router.push("/(tabs)/garments/GarmentCreate")} 
      >
        <Text style={styles.buttonText}>Crear prenda</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>#</Text>
          <Text style={styles.headerCell}>Tipo</Text>
          <Text style={styles.headerCell}>Descripción</Text>
          <Text style={styles.headerCell}>Opciones</Text>
        </View>

        {garments.map((g, i) => (
          <View key={g.id} style={styles.tableRow}>
            <Text style={styles.cell}>{i + 1}</Text>
            <Text style={styles.cell}>{g.type}</Text>
            <Text style={styles.cell}>{g.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setCurrentGarment(g);
                  setShowModalEdit(true);
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteGarment(g.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showModalEdit} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModalEdit(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>

            {currentGarment && (
              <Edit
                close={setShowModalEdit}
                reload={getGarments}
                garment={currentGarment}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  buttonCreate: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  tableHeader: { flexDirection: "row", backgroundColor: "#eee", padding: 8 },
  headerCell: { flex: 1, fontWeight: "bold", textAlign: "center" },
  tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  cell: { flex: 1, textAlign: "center" },
  actions: { flexDirection: "row", gap: 6 },
  editButton: { backgroundColor: "blue", padding: 6, borderRadius: 4 },
  deleteButton: { backgroundColor: "red", padding: 6, borderRadius: 4 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 8, width: "90%" },
  closeButton: { backgroundColor: "gray", padding: 8, borderRadius: 4, marginBottom: 10 },
});
