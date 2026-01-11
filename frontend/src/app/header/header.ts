import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMenuOpen: boolean = false; 



  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {
   
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isCustomer(){
    const details = this.authService.currentUserDetails;
    const user = this.authService.currentUser;
    if (!details || !user) return true;
    return details.role !== 'admin' && user.role !== 'staff';
  }
  get isAdmin(){
    return this.authService.currentUserDetails?.role === 'admin';
  }
}
