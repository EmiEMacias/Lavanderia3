import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const menuItems = [
  { name: "Dashboard", label: "Inicio" },
  { name: "CreateOrder", label: "Crear Orden" },
  { name: "Clientes", label: "Clientes" },
  { name: "Servicios", label: "Servicios" },
  { name: "Prendas", label: "Prendas" },
  { name: "Ordenes", label: "Órdenes" },
];

export default function SubMenu({ navigation }) {
  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.menuButton}
          onPress={() => navigation.navigate(item.name)}
        >
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  menuButton: {
    backgroundColor: "#dfe6e9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    margin: 4,
  },
  menuText: {
    color: "#2e86de",
    fontWeight: "bold",
    fontSize: 15,
  },
});