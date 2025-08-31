import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SingleTonApi } from "../../../../../core/services/single-ton-api.service";
import { Order, OrderStatus, UserOrders } from "../../../../../core/interfaces/order.interface";
import { CartProduct } from "../../../../../core/interfaces/carts.interface";



@Injectable({
  providedIn: 'root'
})

export class OrderService {
    private readonly singleTonApi = inject(SingleTonApi);
    private readonly endPoint : string = "orders"


    createOrder(data : UserOrders) : Observable<{data : UserOrders , message : string}> { 
    return this.singleTonApi.create(`${this.endPoint}` , data);
    }
    
    getAllUserOrders() : Observable<{
    data : {orders : UserOrders[] ,currentPage : number , totalPages: number , total : number},
    message : string}> { 
    return this.singleTonApi.findData(`${this.endPoint}`);
    }

    getUserOrders(userId : string) : Observable<{data : UserOrders , message : string}> { 
    return this.singleTonApi.findDataById(this.endPoint , userId);
    }

    updateOrderStatus(orderId : string , userId : string , status : OrderStatus) 
    : Observable<{data : Order , message : string}> { 
    return this.singleTonApi.updateById(this.endPoint , {userId , status}  , orderId);
    }

    deleteUserOrder(ordersIds : string[] ): Observable<{data : Order[] , message : string}> { 
    return this.singleTonApi.deleteByIdWithBody(this.endPoint , {ordersIds});
    }

}
