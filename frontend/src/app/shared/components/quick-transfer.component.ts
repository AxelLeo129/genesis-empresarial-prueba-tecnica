import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../core/models';

@Component({
  selector: 'app-quick-transfer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './quick-transfer.component.html',
  styleUrl: './quick-transfer.component.scss'
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
