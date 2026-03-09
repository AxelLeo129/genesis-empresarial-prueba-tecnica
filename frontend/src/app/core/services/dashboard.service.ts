import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  HomeData,
  AccountsData,
  WeeklyActivity,
  ExpenseStat,
  BalanceHistory,
  CreditDebitSummary,
  AccountCard,
  RecentTransaction,
  AccountsSummary
} from '../models';
import { Contact, ScheduledPayment } from '../models/payment.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Get all data for home page
   */
  getHomeData(clientId?: number): Observable<HomeData> {
    const params = clientId ? `?clientId=${clientId}` : '';
    return this.http.get<ApiResponse<HomeData>>(`${this.baseUrl}/dashboard/home${params}`).pipe(
      map(response => response?.data ?? this.getMockHomeData()),
      catchError(() => of(this.getMockHomeData()))
    );
  }

  /**
   * Get all data for accounts page
   */
  getAccountsData(clientId?: number): Observable<AccountsData> {
    const params = clientId ? `?clientId=${clientId}` : '';
    return this.http.get<ApiResponse<AccountsData>>(`${this.baseUrl}/dashboard/accounts${params}`).pipe(
      map(response => response?.data ?? this.getMockAccountsData()),
      catchError(() => of(this.getMockAccountsData()))
    );
  }

  /**
   * Mock data for home page - used when API is unavailable
   */
  private getMockHomeData(): HomeData {
    return {
      client: {
        id: 1,
        name: 'Eddy Cusuma',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      cards: [
        {
          id: 1,
          balance: 5756,
          holderName: 'Eddy Cusuma',
          cardNumber: '3778123456781234',
          expirationDate: '12/22',
          cardType: 'debit'
        },
        {
          id: 2,
          balance: 5756,
          holderName: 'Eddy Cusuma',
          cardNumber: '3778123456781234',
          expirationDate: '12/22',
          cardType: 'credit'
        }
      ],
      recentTransactions: [
        { id: 1, description: 'Deposito Tarjeta', type: 'deposit', amount: 850, date: '2026-01-28', status: 'completed' },
        { id: 2, description: 'Deposito Paypal', type: 'deposit', amount: 2500, date: '2026-01-25', status: 'completed' },
        { id: 3, description: 'Joan Arango', type: 'transfer', amount: 5400, date: '2026-01-21', status: 'completed' }
      ],
      weeklyActivity: [
        { day: 'Lunes', deposits: 250, withdrawals: 150 },
        { day: 'Martes', deposits: 350, withdrawals: 200 },
        { day: 'Miercoles', deposits: 450, withdrawals: 280 },
        { day: 'Jueves', deposits: 300, withdrawals: 320 },
        { day: 'Viernes', deposits: 480, withdrawals: 350 },
        { day: 'Sabado', deposits: 200, withdrawals: 180 },
        { day: 'Domingo', deposits: 150, withdrawals: 100 }
      ],
      expenseStats: [
        { category: 'entertainment', label: 'Entretenimiento', amount: 1200, percentage: 30, color: '#3B5BDB' },
        { category: 'bills', label: 'Facturas', amount: 600, percentage: 15, color: '#FFA94D' },
        { category: 'investment', label: 'Inversión', amount: 800, percentage: 20, color: '#5C7CFA' },
        { category: 'other', label: 'Otros', amount: 1400, percentage: 35, color: '#20C997' }
      ],
      contacts: [
        { id: 1, clientId: 1, name: 'Victoria', relationship: 'Amiga', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
        { id: 2, clientId: 1, name: 'Raúl', relationship: 'Hermano', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { id: 3, clientId: 1, name: 'José', relationship: 'Primo', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' }
      ],
      balanceHistory: [
        { month: 'Agosto', balance: 200 },
        { month: 'Septiembre', balance: 350 },
        { month: 'Octubre', balance: 280 },
        { month: 'Noviembre', balance: 450 },
        { month: 'Diciembre', balance: 520 },
        { month: 'Enero', balance: 680 },
        { month: 'Febrero', balance: 750 }
      ]
    };
  }

  /**
   * Mock data for accounts page - used when API is unavailable
   */
  private getMockAccountsData(): AccountsData {
    return {
      summary: {
        totalBalance: 12750,
        totalIncome: 5600,
        totalExpenses: 3460,
        totalSavings: 7920
      },
      transactions: [
        {
          id: 1,
          accountId: 1,
          description: 'Spotify Subscription',
          type: 'purchase',
          category: 'entertainment',
          amount: 150,
          status: 'pending',
          transactionDate: '2026-01-25',
          date: '25 Enero 2026',
          cardNumber: '1234 ****'
        },
        {
          id: 2,
          accountId: 1,
          description: 'Mobile Service',
          type: 'service',
          category: 'bills',
          amount: 340,
          status: 'completed',
          transactionDate: '2026-01-25',
          date: '25 Enero 2026',
          cardNumber: '1234 ****'
        },
        {
          id: 3,
          accountId: 1,
          description: 'Emilly Wilson',
          type: 'transfer',
          category: 'other',
          amount: 780,
          status: 'completed',
          transactionDate: '2026-01-25',
          date: '25 Enero 2026',
          cardNumber: '1234 ****'
        }
      ],
      card: {
        id: 1,
        balance: 5756,
        holderName: 'Eddy Cusuma',
        cardNumber: '3778123456781234',
        expirationDate: '12/22'
      },
      creditDebitSummary: [
        { month: 'Agosto', credit: 400, debit: 250 },
        { month: 'Septiembre', credit: 350, debit: 300 },
        { month: 'Octubre', credit: 500, debit: 280 },
        { month: 'Noviembre', credit: 420, debit: 350 },
        { month: 'Diciembre', credit: 480, debit: 320 },
        { month: 'Enero', credit: 550, debit: 400 },
        { month: 'Febrero', credit: 600, debit: 450 }
      ],
      scheduledPayments: [
        { id: 1, accountId: 1, description: 'Apple Store', amount: 450, scheduledDate: '2026-03-09', date: '5h ago', icon: 'apple', isActive: true },
        { id: 2, accountId: 1, description: 'Michael', amount: 160, scheduledDate: '2026-03-07', date: '2 days ago', icon: 'user', isActive: true },
        { id: 3, accountId: 1, description: 'Playstation', amount: 1085, scheduledDate: '2026-03-04', date: '5 days ago', icon: 'gamepad', isActive: true },
        { id: 4, accountId: 1, description: 'William', amount: 90, scheduledDate: '2026-02-27', date: '10 days ago', icon: 'user', isActive: true }
      ]
    };
  }
}
