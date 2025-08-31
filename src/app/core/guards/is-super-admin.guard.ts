import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.signal';
import { Role } from '../interfaces/user.interface';



export const isSuperAdminGuard: CanMatchFn = (route, state): boolean => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const backToHome = () => {
  router.navigateByUrl('/dashboard/home');
  return false
  };
  
const userRole : Role = authStore.user()?.role!;

if((userRole && userRole !== 'SuperAdmin') || !userRole ) {
backToHome();
}

return true
};