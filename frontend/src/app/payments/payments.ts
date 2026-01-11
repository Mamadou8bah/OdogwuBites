import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../service/payment.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments implements OnInit {
  payments: any[] = [];
  isLoading: boolean = true;
  user: any = null;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (this.user) {
      this.loadPayments();
    } else {
      this.isLoading = false;
    }
  }

  loadPayments(): void {
    this.isLoading = true;
    if (this.user.role === 'admin') {
      this.paymentService.getAllPayments().subscribe({
        next: (data) => {
          this.payments = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching all payments:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.paymentService.getUserPayments(this.user._id).subscribe({
        next: (data) => {
          this.payments = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user payments:', err);
          this.isLoading = false;
        }
      });
    }
  }

  confirmPayment(paymentId: string): void {
    if (confirm('Are you sure you want to confirm this payment? This will update the user\'s balance.')) {
      this.paymentService.confirmPayment(paymentId).subscribe({
        next: (res) => {
          alert('Payment confirmed and user balance updated!');
          this.loadPayments();
        },
        error: (err) => {
          console.error('Error confirming payment:', err);
          alert(err.error?.message || 'Error confirming payment');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed': 
        return 'bg-green-500/10 text-green-500';
      case 'pending': 
        return 'bg-orange-500/10 text-orange-400';
      case 'failed': 
        return 'bg-red-500/10 text-red-500';
      default: 
        return 'bg-gray-500/10 text-gray-400';
    }
  }
}
 