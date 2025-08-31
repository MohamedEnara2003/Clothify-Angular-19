import { Product } from "./products.interface";


export interface CartProductSize {
    size_id : string ,
    size : string ,
    stock : number ,
}

export interface CartProduct {
    productId :  Product ,
    quantity : number ,
    selectedSize : CartProductSize | null,
}
export interface Cart {
    userId : string ,
    productId : string ,
    quantity : number  ,
    selectedSize? : CartProductSize
}

export interface CartWithProduct {
    _id : string ,
    userId : string ,
    products : CartProduct[],
}

