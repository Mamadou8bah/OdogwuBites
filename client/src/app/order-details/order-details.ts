import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  order: any;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.order = orders.find((o: any) => o._id === id);
        if (this.order) {
          this.generateMapUrl();
        }
      },
      error: (err) => console.error(err)
    });
  }

  updateStatus(newStatus: string) {
    if (this.order) {
      if (newStatus === 'Delivered') {
        this.orderService.deliverOrder(this.order._id).subscribe(() => this.order.status = 'Delivered');
      } else if (newStatus === 'Cancelled') {
        this.orderService.cancelOrder(this.order._id).subscribe(() => this.order.status = 'Cancelled');
      }
    }
  }

  goBack() {
    this.location.back();
  }

  printOrder() {
    window.print();
  }

  generateMapUrl() {
    const location = this.order.address || 'Banjul';
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}