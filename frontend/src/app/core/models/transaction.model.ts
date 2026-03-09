export type TransactionType = 'deposit' | 'withdrawal' | 'purchase' | 'service' | 'transfer';
export type TransactionCategory = 'entertainment' | 'bills' | 'investment' | 'other' | 'income';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: number;
  accountId: number;
  description: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  status: TransactionStatus;
  recipientCard?: string;
  recipientName?: string;
  transactionDate: string;
  date?: string;
  cardNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecentTransaction {
  id: number;
  description: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
}
