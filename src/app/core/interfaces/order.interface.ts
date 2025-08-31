import { PaymentMethod } from "../../feature/checkout/interface/checkout.interface";
import { CartProduct } from "./carts.interface";


export type OrderStatus = 'Pending' | 'Accepted' | 'Shipped' | 'Delivered' | 'Cancelled' ;

export interface UserOrderData {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    country: string;
    city: string;
    stateRegion: string;
    postalCode: string;
}

export interface Receipt {
    receipt_img : string ,
    receipt_id : string ,
}

export interface Order {
    _id?: string;
    products: CartProduct[];
    paymentMethod?: PaymentMethod;
    orderStatus: OrderStatus; 
    userData: UserOrderData;
    receipt?: Receipt ;
    totalPrice: number;
    createdAt?: string;
}

export interface UserOrders {
    _id?: string;
    userId: string;
    orders: Order[]
}
