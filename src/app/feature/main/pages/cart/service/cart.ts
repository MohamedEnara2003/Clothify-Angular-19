import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/single-ton-api.service';
import { Observable } from 'rxjs';
import { Cart, CartProductSize, CartWithProduct } from '../../../../../core/interfaces/carts.interface';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly singleTonApi = inject(SingleTonApi);
  private readonly endPoint  = 'carts';
  
  cartCount = signal<number>(0);
  
  getAllCarts() : Observable<CartWithProduct[]> {
  return this.singleTonApi.findData(this.endPoint);
  }
  
  getUserCart(userId : string) : Observable<{data : CartWithProduct , message : string}> {
  return this.singleTonApi.findDataById(`${this.endPoint}/user` , userId);
  }
  
  addProductToCart(cart : Cart) : Observable<{data : CartWithProduct , message : string}> {
  return this.singleTonApi.create(this.endPoint , cart);
  }
  
  updateQuantity(cartId : string , userId : string , selectedSize : CartProductSize | null ,productId : string ,  quantity : number)
  : Observable<{data : CartWithProduct , message : string}> {
  const data = {quantity , productId , selectedSize, userId};
  return this.singleTonApi.updateById(`${this.endPoint}/update-quantity`,data , cartId);
  }

  updateSize(cartId : string , userId : string , productId : string  , selectedSize: CartProductSize  )
  : Observable<{data : CartWithProduct , message : string}> {
  const data = {selectedSize , productId , userId};
  return this.singleTonApi.updateById(`${this.endPoint}/update-size`, data , cartId);
  }
  
  removeProductFromCart(cartId : string  , productId : string , size_id : string | null)
  : Observable<{data : CartWithProduct , message : string}> {
  return this.singleTonApi.deleteByIdWithBody(`${this.endPoint}/delete-product`,  {cartId , productId , size_id});
  }
  
}
