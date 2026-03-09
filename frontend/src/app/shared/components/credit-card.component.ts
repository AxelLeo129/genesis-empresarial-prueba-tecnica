import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-credit-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss'
})
export class CreditCardComponent {
  readonly balance = input<number>(0);
  readonly holderName = input<string>('');
  readonly cardNumber = input<string>('');
  readonly expirationDate = input<string>('');
  readonly variant = input<'dark' | 'light'>('dark');
  readonly showToggle = input<boolean>(true);

  readonly cardClasses = computed(() => {
    const base = 'rounded-2xl p-5 min-w-[280px] transition-shadow hover:shadow-card-hover';
    return this.variant() === 'dark'
      ? `${base} bg-gradient-to-br from-primary-500 to-primary-400 text-white shadow-card`
      : `${base} bg-white border border-gray-200 shadow-soft`;
  });

  readonly chipClasses = computed(() => {
    return this.variant() === 'dark' ? 'text-white/80' : 'text-primary-500';
  });

  readonly maskedCardNumber = computed(() => {
    const num = this.cardNumber();
    if (num.length < 8) return num;
    const last4 = num.slice(-4);
    const first4 = num.slice(0, 4);
    return `${first4} **** **** ${last4}`;
  });
}
