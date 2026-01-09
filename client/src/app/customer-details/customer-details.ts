import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { clients } from '../data/clients';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css',
})
export class CustomerDetails {
  id: string | null = null;
  ordersPageSize = 4;
  private _ordersPage = 1;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  protected readonly customers = clients as unknown as any[];

  get customer(): any {
    const customerId = Number(this.id);
    return this.customers.find(c => c.id == customerId);
  }

  get orders(): any[] {
    return this.customer?.orders ?? [];
  }

  get ordersTotalPages(): number {
    return Math.max(1, Math.ceil(this.orders.length / this.ordersPageSize));
  }

  get ordersPage(): number {
    return this._ordersPage;
  }

  set ordersPage(value: number) {
    this._ordersPage = this.clampOrdersPage(value);
  }

  get pagedOrders(): any[] {
    const page = this.clampOrdersPage(this._ordersPage);
    const start = (page - 1) * this.ordersPageSize;
    return this.orders.slice(start, start + this.ordersPageSize);
  }

  goToPrevOrdersPage(): void {
    this.ordersPage = this._ordersPage - 1;
  }

  goToNextOrdersPage(): void {
    this.ordersPage = this._ordersPage + 1;
  }

  private clampOrdersPage(page: number): number {
    const total = this.ordersTotalPages;
    return Math.min(Math.max(page, 1), total);
  }


  get safeMapUrl(): SafeResourceUrl | null {
    const address = this.customer?.address;
    if (!address) return null;

    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}