import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TransactionType, TransactionStatus } from '../../core/models';

@Component({
  selector: 'app-transaction-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.scss'
})
export class TransactionRowComponent {
  readonly description = input<string>('');
  readonly type = input<TransactionType>('deposit');
  readonly amount = input<number>(0);
  readonly date = input<string>('');
  readonly status = input<TransactionStatus>('completed');
  readonly showStatus = input<boolean>(false);

  readonly typeIcon = computed(() => {
    const icons: Record<TransactionType, string> = {
      deposit: `<svg fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`,
      withdrawal: `<svg fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>`,
      purchase: `<svg fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`,
      service: `<svg fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
      transfer: `<svg fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>`
    };
    return icons[this.type()];
  });

  readonly iconBgColor = computed(() => {
    const colors: Record<TransactionType, string> = {
      deposit: '#20C997',
      withdrawal: '#FF6B6B',
      purchase: '#FFA94D',
      service: '#5C7CFA',
      transfer: '#3B5BDB'
    };
    return colors[this.type()];
  });

  readonly amountPrefix = computed(() => {
    return this.type() === 'deposit' ? '+' : '-';
  });

  readonly amountClass = computed(() => {
    const base = 'font-semibold';
    return this.type() === 'deposit'
      ? `${base} text-green-600`
      : `${base} text-red-500`;
  });

  readonly statusClass = computed(() => {
    const classes: Record<TransactionStatus, string> = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-error'
    };
    return classes[this.status()];
  });

  readonly statusLabel = computed(() => {
    const labels: Record<TransactionStatus, string> = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido'
    };
    return labels[this.status()];
  });

  readonly formattedDate = computed(() => {
    const d = this.date();
    if (!d) return '';
    try {
      const date = new Date(d);
      const day = date.getDate();
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return d;
    }
  });
}
