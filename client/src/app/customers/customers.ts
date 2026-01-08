import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { clients } from '../data/clients';

@Component({
  selector: 'app-customers',
	standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  protected readonly customers = clients as unknown as Customer[];

  searchTerm = '';
  sortOrder: SortOrder = 'newest';

  pageSize = 10;
  currentPage = 1;

  private readonly selectedIds = new Set<number>();

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

  isSelected(customerId: number): boolean {
    return this.selectedIds.has(customerId);
  }

  toggleSelected(customerId: number, checked: boolean): void {
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

  exportVisibleToCsv(): void {
    const rows = this.visibleCustomers;
    const headers = ['Name', 'Phone', 'Email', 'Address', 'TotalPayments'];
    const lines = [
      headers.join(','),
      ...rows.map((c) =>
        [
          this.csvCell(c.name ?? ''),
          this.csvCell(c.phone ?? ''),
          this.csvCell(c.email ?? ''),
          this.csvCell(this.addressLabel(c)),
          this.csvCell(String(c.totalPayments ?? 0)),
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  trackById(_: number, item: Customer): number {
    return item.id;
  }

  private getRegistrationTime(customer: Customer): number {
    const raw = customer.registrationDate;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private csvCell(value: string): string {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
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
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: CustomerAddress;
  totalPayments?: number;
  registrationDate?: string;
};
