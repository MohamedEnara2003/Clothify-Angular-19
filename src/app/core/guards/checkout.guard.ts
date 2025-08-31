import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { CartStore } from '../../store/cart/cart.signal';

export const checkoutGuard: CanMatchFn = (route, segments) => {

  const cartStore = inject(CartStore);
  if(cartStore.cartCount() === 0){
  return false
  }
  return true;
};
