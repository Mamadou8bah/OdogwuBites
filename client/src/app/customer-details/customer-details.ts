import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { Subscription } from 'rxjs';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css',
})
export class CustomerDetails implements OnDestroy {
  id: string | null = null;
  ordersPageSize = 4;
  private _ordersPage = 1;

  isLoading = false;
  loadError: string | null = null;

  customer: CustomerVm | null = null;
  private recentOrders: CustomerOrderVm[] = [];
  private readonly routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private usersService: UsersService
  ) {
    this.routeSub = this.route.paramMap.subscribe((pm) => {
      this.id = pm.get('id');
      if (!this.id) {
        this.customer = null;
        this.recentOrders = [];
        return;
      }
      this.loadCustomer(this.id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  private loadCustomer(userId: string): void {
    this.isLoading = true;
    this.loadError = null;

    this.usersService.getUserById(userId).subscribe({
      next: (res) => {
        const user = res?.user;
        this.customer = user
          ? {
              id: String(user._id),
              name: user.name,
              email: user.email,
              phone: user.phone != null ? String(user.phone) : undefined,
              avatar: undefined,
              address: user.address ? { street: user.address } : undefined,
              totalPayments: res?.metrics?.totalPayments ?? 0,
              orderFrequency: res?.metrics?.orderCount ?? 0,
              registrationDate: user.createdAt
            }
          : null;

        const orders = Array.isArray(res?.recentOrders) ? res.recentOrders : [];
        this.recentOrders = orders.map((o) => ({
          item: o.item,
          total: o.total,
          orderDate: o.createdAt,
          status: String(o.status || '').toLowerCase()
        }));

        this._ordersPage = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.loadError = err?.error?.message || 'Failed to load user';
        this.customer = null;
        this.recentOrders = [];
        this.isLoading = false;
      }
    });
  }

  get orders(): CustomerOrderVm[] {
    return this.recentOrders;
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

  get pagedOrders(): CustomerOrderVm[] {
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

    const parts = [address.street, address.city, address.state, address.zipCode, address.country]
      .map((p) => (p ?? '').trim())
      .filter(Boolean);
    if (parts.length === 0) return null;
    const fullAddress = parts.join(', ');

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  initials(): string {
    const name = (this.customer?.name ?? '').trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase();
  }
}

type CustomerAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

type CustomerVm = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: CustomerAddress;
  totalPayments?: number;
  orderFrequency?: number;
  registrationDate?: string;
};

type CustomerOrderVm = {
  item: string;
  total: number;
  orderDate: string;
  status: string;
};