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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
