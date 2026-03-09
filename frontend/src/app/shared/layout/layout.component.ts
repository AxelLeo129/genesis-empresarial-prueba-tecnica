import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <app-sidebar />

      <!-- Main content area -->
      <div class="ml-64 min-h-screen">
        <!-- Header -->
        <app-header [title]="pageTitle()" />

        <!-- Page content -->
        <main class="p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class LayoutComponent {
  readonly pageTitle = input<string>('Dashboard');
}
