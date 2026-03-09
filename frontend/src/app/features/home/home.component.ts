import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services';
import { HomeData, WeeklyActivity, ExpenseStat, BalanceHistory, AccountCard, RecentTransaction } from '../../core/models';
import { Contact } from '../../core/models/payment.model';
import { CreditCardComponent } from '../../shared/components/credit-card.component';
import { TransactionRowComponent } from '../../shared/components/transaction-row.component';
import { BarChartComponent, BarChartData } from '../../shared/components/bar-chart.component';
import { PieChartComponent, PieChartData } from '../../shared/components/pie-chart.component';
import { LineChartComponent, LineChartData } from '../../shared/components/line-chart.component';
import { QuickTransferComponent } from '../../shared/components/quick-transfer.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CreditCardComponent,
    TransactionRowComponent,
    BarChartComponent,
    PieChartComponent,
    LineChartComponent,
    QuickTransferComponent
  ],
  template: `
    <div class="animate-fadeIn">
      <!-- Top Section: Cards and Recent Transactions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- My Cards section -->
        <div class="lg:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Mis Tarjetas</h2>
            <a href="#" class="text-sm text-primary-500 hover:text-primary-600">Ver más</a>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2">
            @for (card of cards(); track card.id; let i = $index) {
              <app-credit-card
                [balance]="card.balance"
                [holderName]="card.holderName"
                [cardNumber]="card.cardNumber"
                [expirationDate]="card.expirationDate"
                [variant]="i === 0 ? 'dark' : 'light'"
              />
            }
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Transacciones Recientes</h2>
          <div class="space-y-1">
            @for (tx of recentTransactions(); track tx.id) {
              <app-transaction-row
                [description]="tx.description"
                [type]="tx.type"
                [amount]="tx.amount"
                [date]="tx.date"
              />
            }
          </div>
        </div>
      </div>

      <!-- Middle Section: Weekly Activity and Expense Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Weekly Activity Chart -->
        <div class="lg:col-span-2 card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h2>
          <app-bar-chart
            [data]="weeklyChartData()"
            label1="Deposito"
            label2="Retiro"
            color1="#20C997"
            color2="#5C7CFA"
          />
        </div>

        <!-- Expense Statistics -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Gastos</h2>
          <app-pie-chart [data]="expenseChartData()" />
        </div>
      </div>

      <!-- Bottom Section: Quick Transfer and Balance History -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Transfer -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Transferencia Rápida</h2>
          <app-quick-transfer
            [contacts]="contacts()"
            (transfer)="onTransfer($event)"
          />
        </div>

        <!-- Balance History -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Historial de Saldo</h2>
          <app-line-chart [data]="balanceChartData()" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  // Signals for reactive state
  readonly cards = signal<AccountCard[]>([]);
  readonly recentTransactions = signal<RecentTransaction[]>([]);
  readonly weeklyActivity = signal<WeeklyActivity[]>([]);
  readonly expenseStats = signal<ExpenseStat[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly balanceHistory = signal<BalanceHistory[]>([]);
  readonly loading = signal(true);

  // Computed chart data
  readonly weeklyChartData = signal<BarChartData[]>([]);
  readonly expenseChartData = signal<PieChartData[]>([]);
  readonly balanceChartData = signal<LineChartData[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getHomeData().subscribe({
      next: (data: HomeData) => {
        this.cards.set(data.cards || []);
        this.recentTransactions.set(data.recentTransactions || []);
        this.weeklyActivity.set(data.weeklyActivity || []);
        this.expenseStats.set(data.expenseStats || []);
        this.contacts.set(data.contacts || []);
        this.balanceHistory.set(data.balanceHistory || []);

        // Transform data for charts
        this.weeklyChartData.set(
          (data.weeklyActivity || []).map(w => ({
            label: w.day,
            value1: w.deposits,
            value2: w.withdrawals
          }))
        );

        this.expenseChartData.set(
          (data.expenseStats || []).map(e => ({
            label: e.label,
            value: e.amount,
            percentage: e.percentage,
            color: e.color
          }))
        );

        this.balanceChartData.set(
          (data.balanceHistory || []).map(b => ({
            label: b.month,
            value: b.balance
          }))
        );

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading.set(false);
      }
    });
  }

  onTransfer(event: { contact: Contact; amount: number }): void {
    console.log('Transfer:', event);
    alert(`Transferencia de $${event.amount} a ${event.contact.name} iniciada`);
  }
}
