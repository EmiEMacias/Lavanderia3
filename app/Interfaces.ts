interface IService{
    name:string;
    quantity:number;
    unitPrice:number;
}

interface IGarments{
    id?: number;
    type:string;
    description:string;
    observations:string;
    services:IService[]
}

interface IServiceBackend {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface IOrder{
    id?:number;
    client_id?:number;
    user_id?:number;
    created_at?:Date | string;
    estimated_delivery_date?:string;
    real_delivery_date?:Date | string;
    state:string;
    total:number;
    pagado:boolean;
    garments:IGarments[]    
}

interface IClient {
    id?: number;
    name: string;
    phone_number: number;
    address: string;
    created_at: string | undefined
}

interface IOrderTable {
    id?: number;
    client_name: string;
    user_name: string;
    created_at: string;
    state: string;
    total: number;
}

interface Counting {
    quantity_garments: number;
    quantity_services: number;
    quantity_users: number;
    quantity_clients: number;
}

interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    rol: string;
    state: boolean;
    created_at: string;
}

interface IOrderDetail {
  order_id: number;
  client: string;
  status: string;
  garments: {
    type: string;
    description: string;
    observations: string;
    services: {
      name: string;
      description: string;
      price: number;
      quantity: number;
    }[]
  }[]
}




export type {
    IOrder,
    IGarments,
    IService,
    IOrderTable,
    Counting,
    IServiceBackend,
    IClient,
    IUser,
    IOrderDetail
}