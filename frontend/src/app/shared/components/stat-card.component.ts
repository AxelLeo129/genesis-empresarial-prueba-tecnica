import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="stat-card card-hover">
      <div class="stat-icon" [style.backgroundColor]="iconBgColor()">
        <span [innerHTML]="icon()" class="text-white"></span>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">{{ label() }}</p>
        <p class="text-xl font-bold text-gray-900">
          {{ value() | currency:'$':'symbol':'1.0-0' }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StatCardComponent {
  readonly label = input<string>('');
  readonly value = input<number>(0);
  readonly icon = input<string>('');
  readonly iconBgColor = input<string>('#20C997');
}
