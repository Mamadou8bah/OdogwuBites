import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { PaymentService } from '../service/payment.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage {
  customerInfo = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Banjul',
    postalCode: ''
  };

  selectedPaymentMethod: 'Online' | 'Cash' = 'Online';
  isProcessing: boolean = false;

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router
  ) {
    // Pre-fill with auth user data if available
    const user = this.authService.currentUser;
    if (user) {
      this.customerInfo.name = user.name;
      this.customerInfo.email = user.email;
    }
  }

  get subtotal() {
    return this.cartService.totalPrice;
  }

  get deliveryFee() {
    return 50;
  }

  get total() {
    return this.subtotal + this.deliveryFee;
  }

  goBack() {
    window.history.back();
  }

  placeOrder() {
    if (this.cartService.items.length === 0) return;
    
    // Simple validation
    if (!this.customerInfo.address || !this.customerInfo.phone) {
      alert('Please fill in your delivery address and phone number.');
      return;
    }

    this.isProcessing = true;
    const userId = this.authService.currentUser.id;

    this.paymentService.checkout(userId, this.selectedPaymentMethod).subscribe({
      next: (response) => {
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          this.cartService.clear();
          this.router.navigate(['/dashboard/orders']); // Or a success page
        }
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Checkout failed', error);
        alert('Something went wrong. Please try again.');
        this.isProcessing = false;
      }
    });
  }
}
