import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Dashboard
import Dashboard from './Dashboard';

// Clients
import CreateClient from './clients/CreateClient';
import ListClient from './clients/ListClient';
import EditClient from './clients/EditClient';

// Garments
import CreateGarmentView from './garments/Create';
import EditGarment from './garments/Edit';
import ListGarments from './garments/List';

// Orders
import CreateOrder from './orders/CreateOrder';
import OrderTable from './components/OrderTable';

// Services
import CreateService from './services/CreateService';
import ListService from './services/ListService';

// Users
import CreateUser from './users/CreateUser';
import ListUser from './users/ListUser';
import EditUser from './users/EditUser';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: "Menú Principal" }} />

        {/* Clients */}
        <Stack.Screen name="CreateClient" component={CreateClient} options={{ title: "Crear Cliente" }} />
        <Stack.Screen name="ListClient" component={ListClient} options={{ title: "Lista de Clientes" }} />
        <Stack.Screen name="EditClient" component={EditClient} options={{ title: "Editar Cliente" }} />

        {/* Garments */}
        <Stack.Screen name="CreateGarment" component={CreateGarmentView} options={{ title: "Crear Prenda" }} />
        <Stack.Screen name="ListGarments" component={ListGarments} options={{ title: "Lista de Prendas" }} />
        <Stack.Screen name="EditGarment" component={EditGarment} options={{ title: "Editar Prenda" }} />

        {/* Orders */}
        <Stack.Screen name="CreateOrder" component={CreateOrder} options={{ title: "Crear Orden" }} />
        <Stack.Screen name="OrderTable" component={OrderTable} options={{ title: "Lista de Órdenes" }} />

        {/* Services */}
        <Stack.Screen name="CreateService" component={CreateService} options={{ title: "Crear Servicio" }} />
        <Stack.Screen name="ListService" component={ListService} options={{ title: "Lista de Servicios" }} />

        {/* Users */}
        <Stack.Screen name="CreateUser" component={CreateUser} options={{ title: "Crear Usuario" }} />
        <Stack.Screen name="ListUser" component={ListUser} options={{ title: "Lista de Usuarios" }} />
        <Stack.Screen name="EditUser" component={EditUser} options={{ title: "Editar Usuario" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
