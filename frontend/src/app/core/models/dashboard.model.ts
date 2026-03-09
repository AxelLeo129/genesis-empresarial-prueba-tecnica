import { AccountCard } from './account.model';
import { RecentTransaction, Transaction } from './transaction.model';
import { Contact, ScheduledPayment } from './payment.model';

export interface WeeklyActivity {
  day: string;
  deposits: number;
  withdrawals: number;
}

export interface ExpenseStat {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface BalanceHistory {
  month: string;
  balance: number;
}

export interface CreditDebitSummary {
  month: string;
  credit: number;
  debit: number;
}

export interface DashboardClient {
  id: number;
  name: string;
  avatar?: string;
}

export interface HomeData {
  client: DashboardClient;
  cards: AccountCard[];
  recentTransactions: RecentTransaction[];
  weeklyActivity: WeeklyActivity[];
  expenseStats: ExpenseStat[];
  contacts: Contact[];
  balanceHistory: BalanceHistory[];
}

export interface AccountsSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

export interface AccountsData {
  summary: AccountsSummary;
  transactions: Transaction[];
  card: AccountCard | null;
  creditDebitSummary: CreditDebitSummary[];
  scheduledPayments: ScheduledPayment[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
