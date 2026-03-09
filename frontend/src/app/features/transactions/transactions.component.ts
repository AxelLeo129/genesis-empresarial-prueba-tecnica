import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/services';
import { Transaction } from '../../core/models/transaction.model';
import { TransactionRowComponent } from '../../shared/components/transaction-row.component';

@Component({
  selector: 'app-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TransactionRowComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly transactions = signal<Transaction[]>([]);
  readonly filteredTransactions = signal<Transaction[]>([]);
  readonly loading = signal(true);
  readonly selectedType = signal<string>('');

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.dashboardService.getAccountsData().subscribe({
      next: (data) => {
        this.transactions.set(data.transactions);
        this.filteredTransactions.set(data.transactions);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filterByType(event: Event): void {
    const type = (event.target as HTMLSelectElement).value;
    this.selectedType.set(type);

    if (type) {
      this.filteredTransactions.set(
        this.transactions().filter(tx => tx.type === type)
      );
    } else {
      this.filteredTransactions.set(this.transactions());
    }
  }
}
