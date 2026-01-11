import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './header/header';
import { CommonModule } from '@angular/common';
import { Cart } from "./cart/cart";
import { CartService } from './service/cart.service';
import { NavigationHistoryService } from './service/navigation-history.service';
import { LoadingOverlay } from './loading-overlay/loading-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CommonModule, Cart, LoadingOverlay],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('client');
  isLoginRoute: boolean = false;

  constructor(
    private router: Router,
    public cartService: CartService,
    private navigationHistory: NavigationHistoryService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginRoute = event.url === '/login' || event.url === '/dashboard' || event.url.startsWith('/dashboard/') ||event.url.includes('/login');
      });
  }
}
