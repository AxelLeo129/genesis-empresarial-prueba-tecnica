import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-credit-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div [class]="cardClasses()">
      <!-- Top row -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <p [class]="variant() === 'dark' ? 'text-white/70' : 'text-gray-500'" class="text-xs mb-1">Saldo</p>
          <p [class]="variant() === 'dark' ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold">
            {{ balance() | currency:'$':'symbol':'1.0-0' }}
          </p>
        </div>
        <div [class]="chipClasses()">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="6" width="20" height="12" rx="2" opacity="0.3"/>
            <rect x="6" y="10" width="4" height="4" rx="1"/>
            <rect x="12" y="10" width="4" height="4" rx="1"/>
          </svg>
        </div>
      </div>

      <!-- Holder info -->
      <div class="flex justify-between items-end mb-4">
        <div>
          <p [class]="variant() === 'dark' ? 'text-white/70' : 'text-gray-500'" class="text-xs mb-1">Titular</p>
          <p [class]="variant() === 'dark' ? 'text-white' : 'text-gray-900'" class="font-medium">{{ holderName() }}</p>
        </div>
        <div class="text-right">
          <p [class]="variant() === 'dark' ? 'text-white/70' : 'text-gray-500'" class="text-xs mb-1">Vencimiento</p>
          <p [class]="variant() === 'dark' ? 'text-white' : 'text-gray-900'" class="font-medium">{{ expirationDate() }}</p>
        </div>
      </div>

      <!-- Card number -->
      <div class="flex items-center justify-between">
        <p [class]="variant() === 'dark' ? 'text-white' : 'text-gray-900'" class="font-mono text-lg tracking-wider">
          {{ maskedCardNumber() }}
        </p>
        @if (showToggle()) {
          <button
            class="w-10 h-5 rounded-full relative transition-colors"
            [class]="variant() === 'dark' ? 'bg-white/30' : 'bg-primary-500'"
            (click)="$event.stopPropagation()"
          >
            <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"></span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
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
