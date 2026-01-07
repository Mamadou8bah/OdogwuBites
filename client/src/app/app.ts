import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './header/header';
import { CommonModule } from '@angular/common';
import { Cart } from "./cart/cart";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CommonModule, Cart],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('client');
  isLoginRoute: boolean = false;

  constructor(private router: Router) { 
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginRoute = event.url === '/login' || event.url === '/dashboard';
      });
  }
}
