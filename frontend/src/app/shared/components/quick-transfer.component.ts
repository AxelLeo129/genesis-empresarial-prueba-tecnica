import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../core/models';

@Component({
  selector: 'app-quick-transfer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      <!-- Contacts -->
      <div class="flex items-center gap-4">
        @for (contact of contacts(); track contact.id) {
          <button
            class="flex flex-col items-center gap-2 group"
            [class.ring-2]="selectedContact()?.id === contact.id"
            [class.ring-primary-500]="selectedContact()?.id === contact.id"
            [class.rounded-full]="selectedContact()?.id === contact.id"
            (click)="selectContact(contact)"
          >
            <img
              [src]="contact.avatar || contact.avatarUrl || 'https://via.placeholder.com/48'"
              [alt]="contact.name"
              class="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary-300 transition-colors"
            />
            <div class="text-center">
              <p class="text-sm font-medium text-gray-900">{{ contact.name }}</p>
              <p class="text-xs text-gray-500">{{ contact.relationship }}</p>
            </div>
          </button>
        }
        <!-- More button -->
        <button class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Amount input -->
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <label class="text-sm text-gray-500 mb-1 block">Escribe la Cantidad</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              [(ngModel)]="amountValue"
              class="input pl-7"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <button
          class="btn-secondary px-6 py-3 mt-5"
          [disabled]="!selectedContact() || !amountValue"
          (click)="onSend()"
        >
          Enviar
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class QuickTransferComponent {
  readonly contacts = input<Contact[]>([]);
  readonly transfer = output<{ contact: Contact; amount: number }>();

  readonly selectedContact = signal<Contact | null>(null);
  amountValue = 25.50;

  selectContact(contact: Contact): void {
    this.selectedContact.set(contact);
  }

  onSend(): void {
    const contact = this.selectedContact();
    if (contact && this.amountValue > 0) {
      this.transfer.emit({ contact, amount: this.amountValue });
      // Reset
      this.amountValue = 0;
      this.selectedContact.set(null);
    }
  }
}
