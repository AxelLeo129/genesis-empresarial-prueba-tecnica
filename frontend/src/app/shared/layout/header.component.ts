import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly title = input<string>('Dashboard');
  readonly userName = input<string>('Usuario');
  readonly avatarUrl = input<string>('https://randomuser.me/api/portraits/women/44.jpg');
}
