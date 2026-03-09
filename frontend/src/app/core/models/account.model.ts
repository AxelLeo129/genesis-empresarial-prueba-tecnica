export interface Account {
  id: number;
  clientId: number;
  cardNumber: string;
  balance: number;
  holderName: string;
  expirationDate: string;
  cardType: 'credit' | 'debit';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountCard {
  id: number;
  balance: number;
  holderName: string;
  cardNumber: string;
  expirationDate: string;
  cardType?: 'credit' | 'debit';
}
