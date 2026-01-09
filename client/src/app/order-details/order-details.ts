import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { orders } from '../data/order';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const orderList = orders as any[];
    this.order = orderList.find(o => o.orderId == Number(id));

    console.log(this.order)
    if (this.order) {
      this.generateMapUrl();
    }
  }

  updateStatus(newStatus: string) {
    if (this.order) {
      this.order.status = newStatus;
      // Also update status of items if they show it
      if (this.order.items) {
        this.order.items.forEach((item: any) => item.status = newStatus);
      }
      // In a real app, you would call a service to update the backend
      console.log(`Order ${this.order.orderId} status updated to ${newStatus}`);
    }
  }

  goBack() {
    this.location.back();
  }

  printOrder() {
    window.print();
  }

  generateMapUrl() {
    const location = this.order.delivery.address || 'Banjul';
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}