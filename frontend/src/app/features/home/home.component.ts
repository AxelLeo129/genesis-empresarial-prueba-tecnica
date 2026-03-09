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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
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
