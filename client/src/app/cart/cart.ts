import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from '../data/cartItems';
import { CartService } from '../service/cart.service';
import { PaymentService } from '../service/payment.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  standalone: true
})
export class Cart {
  selectedPaymentMethod: 'Online' | 'Cash' = 'Cash';
  isProcessing: boolean = false;
  checkoutSuccess: boolean = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {}

  get cartItems(): CartItem[] {
    return this.cartService.items;
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }
  
  closeCart():void{
    this.cartService.closeCart();
  }

  continueShopping(): void {
    this.cartService.closeCart();
    this.router.navigate(['/menu']);
  }

  increment(itemId: number): void {
    this.cartService.increment(itemId);
  }

  decrement(itemId: number): void {
    this.cartService.decrement(itemId);
  }

  remove(itemId: number): void {
    this.cartService.remove(itemId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clear();
    }
  }

  goBack(): void {
    this.cartService.closeCart();
    this.router.navigate(['/dashboard']);
  }

  checkout(): void {
    if (this.cartItems.length === 0) return;
    this.router.navigate(['/dashboard/checkout']);
  }
}
