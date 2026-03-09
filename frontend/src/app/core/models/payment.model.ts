export interface ScheduledPayment {
  id: number;
  accountId: number;
  description: string;
  amount: number;
  scheduledDate: string;
  date?: string;
  icon?: string;
  isActive: boolean;
}

export interface Contact {
  id: number;
  clientId: number;
  name: string;
  relationship?: string;
  avatarUrl?: string;
  avatar?: string;
  accountNumber?: string;
}
