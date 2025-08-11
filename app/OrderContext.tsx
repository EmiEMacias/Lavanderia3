import React, { createContext, useContext, useState } from 'react';
import { IOrder } from './Interfaces';

interface OrderContextProps {
  order: IOrder;
  setOrder: React.Dispatch<React.SetStateAction<IOrder>>;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<IOrder>({
    client_id: 1,
    user_id: 1,
    state: 'Pendiente',
    total: 0,
    pagado: false,
    garments: [
    ],
  });

  const resetOrder = () => setOrder({
    client_id: 1,
    user_id: 1,
    state: 'Pendiente',
    total: 0,
    pagado: false,
    garments: [],
  });

  return (
    <OrderContext.Provider value={{ order, setOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};
