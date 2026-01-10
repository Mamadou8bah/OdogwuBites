import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-customers',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  protected customers: Customer[] = [];

  isLoading = false;
  loadError: string | null = null;

  searchTerm = '';
  sortOrder: SortOrder = 'newest';

  pageSize = 10;
  currentPage = 1;

  openActionsForCustomerId: string | null = null;

  private readonly selectedIds = new Set<string>();

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.loadError = null;

    this.usersService.getUsers().subscribe({
      next: (res) => {
        const users = Array.isArray(res?.users) ? res.users : [];
        this.customers = users.map((u) => ({
          id: String(u._id),
          name: u.name,
          email: u.email,
          phone: u.phone != null ? String(u.phone) : undefined,
          address: u.address ? { street: u.address } : undefined,
          totalPayments: u.totalPayments ?? 0,
          registrationDate: u.createdAt
        }));
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loadError = err?.error?.message || 'Failed to load users';
        this.customers = [];
        this.isLoading = false;
      }
    });
  }

  get filteredCustomers(): Customer[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.customers;

    return this.customers.filter((c) => {
      const addressText = this.addressLabel(c).toLowerCase();
      return (
        (c.name ?? '').toLowerCase().includes(query) ||
        (c.email ?? '').toLowerCase().includes(query) ||
        (c.phone ?? '').toLowerCase().includes(query) ||
        addressText.includes(query)
      );
    });
  }

  get sortedCustomers(): Customer[] {
    const copy = [...this.filteredCustomers];
    copy.sort((a, b) => {
      const aTime = this.getRegistrationTime(a);
      const bTime = this.getRegistrationTime(b);
      return this.sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return copy;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedCustomers.length / this.pageSize));
  }

  get visibleCustomers(): Customer[] {
    const safePage = Math.min(Math.max(1, this.currentPage), this.totalPages);
    const start = (safePage - 1) * this.pageSize;
    return this.sortedCustomers.slice(start, start + this.pageSize);
  }

  get pageButtons(): Array<number | '…'> {
    const total = this.totalPages;
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);

    // Match the screenshot-ish: 1 2 3 4 … last
    return [1, 2, 3, 4, '…', total];
  }

  onSearchTermChange(): void {
    this.currentPage = 1;
  }

  onSortOrderChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }

  goPrev(): void {
    this.goToPage(this.currentPage - 1);
  }

  goNext(): void {
    this.goToPage(this.currentPage + 1);
  }

  isSelected(customerId: string): boolean {
    return this.selectedIds.has(customerId);
  }

  toggleSelected(customerId: string, checked: boolean): void {
    if (checked) this.selectedIds.add(customerId);
    else this.selectedIds.delete(customerId);
  }

  isAllVisibleSelected(): boolean {
    const visible = this.visibleCustomers;
    return visible.length > 0 && visible.every((c) => this.selectedIds.has(c.id));
  }

  toggleAllVisible(checked: boolean): void {
    for (const c of this.visibleCustomers) {
      if (checked) this.selectedIds.add(c.id);
      else this.selectedIds.delete(c.id);
    }
  }

  avatarAlt(customer: Customer): string {
    return customer.name ? `${customer.name} avatar` : 'Customer avatar';
  }

  initials(customer: Customer): string {
    const name = (customer.name ?? '').trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase();
  }

  addressLabel(customer: Customer): string {
    const a = customer.address;
    if (!a) return '—';
    return a.city || a.street || '—';
  }

  trackById(_: number, item: Customer): string {
    return item.id;
  }

  toggleActions(customerId: string): void {
    this.openActionsForCustomerId = this.openActionsForCustomerId === customerId ? null : customerId;
  }

  closeActions(): void {
    this.openActionsForCustomerId = null;
  }

  resetPayments(customer: Customer): void {
    customer.totalPayments = 0;
    this.closeActions();
  }

  removeCustomer(customer: Customer): void {
    const idx = this.customers.indexOf(customer);
    if (idx >= 0) (this.customers as Customer[]).splice(idx, 1);
    this.closeActions();
  }

  private getRegistrationTime(customer: Customer): number {
    const raw = customer.registrationDate;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  }
}

type SortOrder = 'newest' | 'oldest';

type CustomerAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

type Customer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: CustomerAddress;
  totalPayments?: number;
  registrationDate?: string;
};
