import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Inicio - Genesis Financial'
  },
  {
    path: 'transacciones',
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent),
    title: 'Transacciones - Genesis Financial'
  },
  {
    path: 'cuentas',
    loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent),
    title: 'Cuentas - Genesis Financial'
  },
  {
    path: 'cuentas/registrar',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
    title: 'Registrar Cuenta - Genesis Financial'
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
