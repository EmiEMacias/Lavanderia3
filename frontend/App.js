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
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Dashboard" component={Dashboard} />

        {/* Clients */}
        <Stack.Screen name="CreateClient" component={CreateClient} />
        <Stack.Screen name="ListClient" component={ListClient} />
        <Stack.Screen name="EditClient" component={EditClient} />

        {/* Garments */}
        <Stack.Screen name="CreateGarment" component={CreateGarmentView} />
        <Stack.Screen name="ListGarments" component={ListGarments} />
        <Stack.Screen name="EditGarment" component={EditGarment} />

        {/* Orders */}
        <Stack.Screen name="CreateOrder" component={CreateOrder} />
        <Stack.Screen name="OrderTable" component={OrderTable} />

        {/* Services */}
        <Stack.Screen name="CreateService" component={CreateService} />
        <Stack.Screen name="ListService" component={ListService} />

        {/* Users */}
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="ListUser" component={ListUser} />
        <Stack.Screen name="EditUser" component={EditUser} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
