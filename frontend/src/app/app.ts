import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from './shared/layout/sidebar.component';
import { HeaderComponent } from './shared/layout/header.component';

@Component({
  selector: 'app-root',
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
      display: block;
    }
  `]
})
export class App {
  private readonly router = inject(Router);

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: '/' }
  );

  readonly pageTitle = computed(() => {
    const url = this.currentUrl();
    const titles: Record<string, string> = {
      '/inicio': 'Inicio',
      '/transacciones': 'Transacciones',
      '/cuentas': 'Cuentas',
      '/cuentas/registrar': 'Registrar Cuenta'
    };
    return titles[url] || 'Dashboard';
  });
}
