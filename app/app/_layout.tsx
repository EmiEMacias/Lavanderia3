import { Slot } from 'expo-router';
import { OrderProvider } from '../OrderContext'; 

export default function Layout() {
  return (
    <OrderProvider>
      <Slot />
    </OrderProvider>
  );
}
