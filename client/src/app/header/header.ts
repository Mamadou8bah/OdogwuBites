import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isMenuOpen: boolean = false;

  constructor(public cartService: CartService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
