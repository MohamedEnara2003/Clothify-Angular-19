import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { OrderService } from "../../feature/main/pages/order/services/order.service";
import { catchError, mergeMap, of, tap } from "rxjs";
import { Router } from "@angular/router";
import { Order, OrderStatus, Receipt, UserOrderData, UserOrders } from "../../core/interfaces/order.interface";
import { AuthStore } from "../auth/auth.signal";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CartStore } from "../cart/cart.signal";
import { PaymentMethod } from "../../feature/checkout/interface/checkout.interface";
import { ProductsStore } from "../products/products.signals";
import { CartProduct } from "../../core/interfaces/carts.interface";
import { AlertService } from "../../core/services/alert.service";




interface OrderState {
    orders  : UserOrders[]
    userOrder: UserOrders | null,
    
     // Dashboard view user order
    orderView : {order : Order , userId :  string} | null,

    selectedPaymentMethod : PaymentMethod,
    uploadedReceipt : Receipt | undefined,
    receiptErrorMsg : string | null,

    currentPage : number ,
    totalPages: number ,
    totalOrders: number ,
    isLoading : boolean ,
    errorMsg : string | null,
}

const initialState : OrderState = {
    orders : [] ,
    userOrder: null,

    // Dashboard view user order
    orderView: null,
  
    selectedPaymentMethod : 'Delivery',
    uploadedReceipt : undefined,
    receiptErrorMsg : null,

    currentPage : 0 ,
    totalPages: 0 ,
    totalOrders : 0 ,
    isLoading : false,
    errorMsg : null,
}

export const OrderStore= signalStore(
    {providedIn : 'root'},
    withState(initialState),

    withComputed((store) => {
    return {

    userOrderCount : computed(() => {
    const orders = store.userOrder()?.orders;
    if(!orders) return 0;
    return orders.length;
    }),

    }
    }), 
 
    withMethods((store) => {
    const orderService = inject(OrderService);
    const cartStore = inject(CartStore);
    const productStore = inject(ProductsStore);
    const authStore = inject(AuthStore);
    const router = inject(Router);
    return {
    
    createOrder (userData : UserOrderData) : void {
    const userId = authStore.user()?.id;
    const cartProducts = cartStore.userCart()?.products!;
    const totalPrice = cartStore.cartTotal();
    const paymentMethod = store.selectedPaymentMethod();
    const uploadedReceipt = store.uploadedReceipt();

    const isReceiptRequired =
    (paymentMethod === 'Vodafone-Cash' || paymentMethod === 'Instapay');

    const hasReceipt = uploadedReceipt !== undefined;

    if (!userId) return;
    if (cartProducts.length === 0) return;

    if (isReceiptRequired && !hasReceipt) {
      return patchState(store, { receiptErrorMsg: 'Receipt image is required' });
    }

        const order : UserOrders = {
            userId ,
            orders : [{
            products : cartProducts,
            orderStatus : 'Pending' ,
            userData ,
            paymentMethod,
            receipt : store.uploadedReceipt() ,
            totalPrice,
            }]
    };
    orderService.createOrder(order).pipe(
    mergeMap( async ({data}) => {
    patchState( store , {userOrder : data});

    for (const cp of cartProducts) {
    await productStore.updateSizeStock(cp);
    }

    router.navigateByUrl('/main/orders');
    cartStore.removeUserAllCartProduct();
    }),
    ).subscribe()
    },
    
    getAllUserOrders() : void {
    patchState(store , {isLoading : true})
    orderService.getAllUserOrders().pipe(
    tap(({data}) => {
    const {orders , currentPage , totalPages , total : totalOrders} = data;

    patchState(store , {
    orders : this.initOrdersSort(orders), currentPage , totalPages , totalOrders , isLoading : false})
    }),

    catchError(({error}) => {
    patchState(store , {errorMsg : error.message , isLoading : false})
    return of(null)
    }),
    takeUntilDestroyed()
    ).subscribe()
    },
    
  

    getUserOrder() : void {
    const userId = authStore.user()?.id;
    if(!userId) return ;
    patchState(store , {isLoading : true})
    orderService.getUserOrders(userId).pipe(
    tap(({data}) => patchState(store , {userOrder : data , isLoading : false})),
    catchError(({error}) => {
    patchState(store , {errorMsg : error.message , isLoading : false})
    return of(null)
    }),
    takeUntilDestroyed()
    ).subscribe()
    },
    

    updateOrderStatus(orderId : string , userId : string, status : OrderStatus) : void {
    if(!userId) return ;
    orderService.updateOrderStatus(orderId , userId , status).pipe(
        tap(({data}) => {

            const prevUserOrders = store.userOrder()?.orders ?? [];
            const prevAllUserOrders = store.orders() ?? [];
        
            const updatedUserOrders = prevUserOrders.map((order) =>
            order._id === orderId ? data : order
            );
        
            const updareAllOrders: UserOrders[] = prevAllUserOrders.map((user) => {
            if (user.userId !== userId) return user;
            return {
                ...user,
                orders: user.orders.map((order) => order._id === orderId ? data : order),
            };
            });

        patchState(store, {
        userOrder: {...store.userOrder()! , orders: updatedUserOrders },
        orders:  this.initOrdersSort(updareAllOrders) , 
        orderView : {...store.orderView()! , order : data}  
    });
    this.openOrderView(null);
    }),
    catchError(({error}) => {
    patchState(store , {errorMsg : error.message , isLoading : false})
    return of(null)
    }),
    ).subscribe();

    },
    
    deleteUserOrder(ordersIds : string[]) : void {
    orderService.deleteUserOrder(ordersIds).pipe(
    tap(() => {
    const updatedOrders = store.orders().map((user) =>  {
    const updatedUserOrders = user.orders.filter((order) => !ordersIds.includes(order._id!));
    return {...user , orders : updatedUserOrders}
    })
    patchState(store , {orders : updatedOrders})
    }),
    catchError(() => {
    patchState(store , {isLoading : false})
    return of(null)
    }),
    ).subscribe();
    },


    uploadReceipt(uploadedReceipt : Receipt | undefined) : void {
    patchState(store , {uploadedReceipt})
    },

    getPaymentMethod(selectedPaymentMethod : PaymentMethod) : void {
    patchState(store , {selectedPaymentMethod})
    },

    openOrderView(orderView : {order : Order , userId : string } | null) : void {
    patchState(store , {orderView})
    },

    initOrdersSort(orders : UserOrders[]) :  UserOrders[]  {
    const statusOrder : OrderStatus[] = ['Pending' , 'Accepted' , 'Shipped' , 'Delivered' , 'Cancelled' ];

    return orders.map((user) => ({...user,
    orders: user.orders.sort((a, b) => statusOrder.indexOf(a.orderStatus) - statusOrder.indexOf(b.orderStatus))
    }));

    }

    }
    })
)
