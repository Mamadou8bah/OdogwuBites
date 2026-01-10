import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';
import { PaymentService } from '../service/payment.service';
import { AuthService } from '../service/auth.service';
import { OrderService } from '../service/order.service';

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

  isProcessing: boolean = false;
  userBalance: number = 0;

  errorMessage: string = '';

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router 
  ) {
    const user = this.authService.currentUser;
    if (user) {
      this.customerInfo.name = user.name;
      this.customerInfo.email = user.email;
    }
    this.cartService.refreshFromServer();
    this.fetchBalance();
  }

  fetchBalance() {
    this.paymentService.getBalance().subscribe({
      next: (data: any) => {
        this.userBalance = data.balance || 0;
      },
      error: (err) => console.error(err)
    });
  }

  depositFunds() {
    const amount = prompt('Enter amount to deposit (GMD):');
    if (amount && !isNaN(Number(amount))) {
      this.paymentService.deposit(Number(amount)).subscribe({
        next: (response) => {
          if (response.paymentUrl) {
            window.open(response.paymentUrl, '_blank');
            alert('Please complete the payment in the new tab and then refresh this page to see your updated balance.');
          }
        },
        error: (err) => alert('Deposit failed: ' + (err.error?.message || 'Unknown error'))
      });
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
    
    if (!this.customerInfo.address || !this.customerInfo.phone) {
      alert('Please fill in your delivery address and phone number.');
      return;
    }

    this.isProcessing = true;
    
    if (this.userBalance < this.total) {
      this.errorMessage = 'Insufficient wallet balance. Please deposit funds.';
      this.isProcessing = false;
      return;
    }

    const orderData = {
      address: this.customerInfo.address,
      phone: this.customerInfo.phone,
      city: this.customerInfo.city,
      postalCode: this.customerInfo.postalCode,
      paymentMethod: 'Wallet',
      deliveryType: 'Delivery',
      deliveryFee: this.deliveryFee,
      notes: '',
      clientRequestId: (globalThis.crypto && 'randomUUID' in globalThis.crypto)
        ? (globalThis.crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        // Server clears the cart; refresh local state + wallet balance.
        this.cartService.refreshFromServer();
        this.fetchBalance();
        this.router.navigate(['/dashboard/orders']);
        this.isProcessing = false;
      },
      error: (error) => {
        alert(error.error?.message || 'Something went wrong. Please try again.');
        this.isProcessing = false;
      }
    });
  }
}
