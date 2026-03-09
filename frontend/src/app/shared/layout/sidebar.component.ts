import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      <!-- Logo -->
      <div class="p-6">
        <div class="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-1">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="sidebar-link-active"
            [routerLinkActiveOptions]="{ exact: item.route === '/inicio' }"
            class="sidebar-link"
          >
            <span [innerHTML]="item.icon" class="w-5 h-5"></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Bottom section -->
      <div class="p-4 border-t border-sidebar-border">
        <div class="text-xs text-gray-400 text-center">
          © 2026 Genesis Financial
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class SidebarComponent {
  readonly navItems = signal<NavItem[]>([
    {
      label: 'Inicio',
      route: '/inicio',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>`
    },
    {
      label: 'Transacciones',
      route: '/transacciones',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
      </svg>`
    },
    {
      label: 'Cuentas',
      route: '/cuentas',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>`
    }
  ]);
}
