import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "./Dashboard";
import CreateOrder from "./orders/create_order";
import Clientes from "./clients/List_clients";
import Servicios from "./services/list_services";
import Prendas from "./garment/list_garments";
import Ordenes from "./orders/create_order";
import CreateClient from "./clients/create_clients";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CreateOrder" component={CreateOrder} />
        <Stack.Screen name="Clientes" component={Clientes} />
        <Stack.Screen name="Servicios" component={Servicios} />
        <Stack.Screen name="Prendas" component={Prendas} />
        <Stack.Screen name="Ordenes" component={Ordenes} />
        <Stack.Screen name="CreateClient" component={CreateClient} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
