import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink } from '@angular/router';
import { CartService } from '../service/cart.service';
import { AuthService } from '../service/auth.service';
import { NavigationHistoryService } from '../service/navigation-history.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isSidebarOpen = false;
  isLoggedIn = localStorage.getItem('token') !== null;
  user=localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;


  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private navigationHistory: NavigationHistoryService,
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout(): void {
    this.closeSidebar();
    this.authService.logout();
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.user = this.authService.currentUser;

    if (!this.isLoggedIn) {
      const redirectUrl = this.navigationHistory.previousUrl;
      this.router.navigate([redirectUrl || '/login']);
    }
  } 
}
