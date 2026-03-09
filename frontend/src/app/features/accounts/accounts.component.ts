import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { DashboardService } from '../../core/services';
import { AccountsData, AccountsSummary, CreditDebitSummary, AccountCard } from '../../core/models';
import { Transaction } from '../../core/models/transaction.model';
import { ScheduledPayment } from '../../core/models/payment.model';
import { CreditCardComponent } from '../../shared/components/credit-card.component';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BarChartComponent, BarChartData } from '../../shared/components/bar-chart.component';

@Component({
  selector: 'app-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, CreditCardComponent, StatCardComponent, BarChartComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly summary = signal<AccountsSummary>({ totalBalance: 0, totalIncome: 0, totalExpenses: 0, totalSavings: 0 });
  readonly transactions = signal<Transaction[]>([]);
  readonly card = signal<AccountCard | null>(null);
  readonly creditDebitSummary = signal<CreditDebitSummary[]>([]);
  readonly scheduledPayments = signal<ScheduledPayment[]>([]);
  readonly loading = signal(true);

  readonly creditDebitChartData = signal<BarChartData[]>([]);

  readonly totalDebit = computed(() =>
    this.creditDebitSummary().reduce((sum, item) => sum + item.debit, 0)
  );

  readonly totalCredit = computed(() =>
    this.creditDebitSummary().reduce((sum, item) => sum + item.credit, 0)
  );

  // Icons as SVG strings
  readonly balanceIcon = `<svg fill="none" stroke="white" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  readonly incomeIcon = `<svg fill="none" stroke="white" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>`;
  readonly expenseIcon = `<svg fill="none" stroke="white" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path></svg>`;
  readonly savingsIcon = `<svg fill="none" stroke="white" viewBox="0 0 24 24" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

  ngOnInit(): void {
    this.loadAccountsData();
  }

  private loadAccountsData(): void {
    this.dashboardService.getAccountsData().subscribe({
      next: (data: AccountsData) => {
        this.summary.set(data.summary);
        this.transactions.set(data.transactions);
        this.card.set(data.card);
        this.creditDebitSummary.set(data.creditDebitSummary);
        this.scheduledPayments.set(data.scheduledPayments);

        this.creditDebitChartData.set(
          data.creditDebitSummary.map(item => ({
            label: item.month,
            value1: item.debit,
            value2: item.credit
          }))
        );

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading accounts data:', err);
        this.loading.set(false);
      }
    });
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      deposit: '#20C997',
      withdrawal: '#FF6B6B',
      purchase: '#FFA94D',
      service: '#5C7CFA',
      transfer: '#3B5BDB'
    };
    return colors[type] || '#6B7280';
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      deposit: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`,
      withdrawal: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>`,
      purchase: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`,
      service: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
      transfer: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>`
    };
    return icons[type] || icons['purchase'];
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      deposit: 'Depósito',
      withdrawal: 'Retiro',
      purchase: 'Compra',
      service: 'Servicio',
      transfer: 'Transferencia'
    };
    return labels[type] || type;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-error'
    };
    return classes[status] || 'badge';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido'
    };
    return labels[status] || status;
  }

  getPaymentIcon(icon?: string): string {
    const icons: Record<string, string> = {
      apple: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`,
      user: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
      gamepad: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>`
    };
    return icons[icon || 'user'] || icons['user'];
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getTimeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays} days ago`;
  }
}
