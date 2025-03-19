import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = !!authService.currentUserValue;
  const isAuthRoute = state.url === '/login' || state.url === '/register';

  if (isAuthenticated) {
    if (isAuthRoute) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  } else {
    if (!isAuthRoute) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }
};
