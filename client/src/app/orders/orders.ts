import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { orders as ordersData } from '../data/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  protected readonly orders = ordersData as unknown as Order[];

  searchTerm = '';
  sortOrder: SortOrder = 'newest';

  pageSize = 10;
  currentPage = 1;

  openActionsForOrderId: number | null = null;

  private readonly selectedIds = new Set<number>();

  get filteredOrders(): Order[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.orders;

    return this.orders.filter((o) => {
      const orderIdText = String(o.orderId ?? '');
      const clientText = (o.clientName ?? '').toLowerCase();
      const driverText = (o.delivery?.driver?.name ?? '').toLowerCase();
      const addressText = (o.delivery?.address ?? '').toLowerCase();
      const statusText = (o.status ?? '').toLowerCase();
      const restaurantText = this.restaurantLabel(o).toLowerCase();

      return (
        orderIdText.includes(query) ||
        clientText.includes(query) ||
        driverText.includes(query) ||
        addressText.includes(query) ||
        statusText.includes(query) ||
        restaurantText.includes(query)
      );
    });
  }

  get sortedOrders(): Order[] {
    const copy = [...this.filteredOrders];
    copy.sort((a, b) => {
      const aTime = this.getOrderTime(a);
      const bTime = this.getOrderTime(b);
      return this.sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return copy;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedOrders.length / this.pageSize));
  }

  get visibleOrders(): Order[] {
    const safePage = Math.min(Math.max(1, this.currentPage), this.totalPages);
    const start = (safePage - 1) * this.pageSize;
    return this.sortedOrders.slice(start, start + this.pageSize);
  }

  get pageButtons(): Array<number | '…'> {
    const total = this.totalPages;
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);

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

  isSelected(orderId: number): boolean {
    return this.selectedIds.has(orderId);
  }

  toggleSelected(orderId: number, checked: boolean): void {
    if (checked) this.selectedIds.add(orderId);
    else this.selectedIds.delete(orderId);
  }

  isAllVisibleSelected(): boolean {
    const visible = this.visibleOrders;
    return visible.length > 0 && visible.every((o) => this.selectedIds.has(o.orderId));
  }

  toggleAllVisible(checked: boolean): void {
    for (const o of this.visibleOrders) {
      if (checked) this.selectedIds.add(o.orderId);
      else this.selectedIds.delete(o.orderId);
    }
  }

  restaurantLabel(order: Order): string {
    const fromItem = order.items?.[0]?.category ?? order.items?.[0]?.name;
    if (typeof fromItem === 'string' && fromItem.trim()) return fromItem;
    if (order.orderSource) return this.titleCase(order.orderSource.replace(/_/g, ' '));
    return 'Odogwu Bites';
  }

  deliveryName(order: Order): string {
    return order.delivery?.driver?.name ?? '—';
  }

  locationLabel(order: Order): string {
    const raw = order.delivery?.address ?? '';
    if (!raw.trim()) return '—';
    const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
    // Typical: "Street, City, State ZIP" -> show City
    if (parts.length >= 2) return parts[1];
    return parts[0] ?? '—';
  }

  dateLabel(order: Order): string {
    const t = this.getOrderTime(order);
    if (!t) return '—';
    return new Date(t).toLocaleDateString();
  }

  timeLabel(order: Order): string {
    const t = this.getOrderTime(order);
    if (!t) return '—';
    return new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  statusLabel(order: Order): string {
    const s = (order.status ?? '').toLowerCase();
    if (!s) return '—';
    return this.titleCase(s.replace(/_/g, ' '));
  }

  statusPillClass(order: Order): string {
    const s = (order.status ?? '').toLowerCase();
    if (s === 'delivered') return 'border-green-500/30 bg-green-500/15 text-green-300';
    if (s === 'canceled' || s === 'cancelled') return 'border-red-500/30 bg-red-500/15 text-red-300';
    if (s === 'confirmed' || s === 'preparing' || s === 'out_for_delivery') {
      return 'border-orange-500/30 bg-orange-500/15 text-orange-300';
    }
    return 'border-neutral-700 bg-neutral-950 text-gray-300';
  }

  exportVisibleToCsv(): void {
    const rows = this.visibleOrders;
    const headers = ['OrderNo', 'Restaurant', 'DeliveryName', 'Date', 'Time', 'Location', 'Status'];
    const lines = [
      headers.join(','),
      ...rows.map((o) =>
        [
          this.csvCell(String(o.orderId ?? '')),
          this.csvCell(this.restaurantLabel(o)),
          this.csvCell(this.deliveryName(o)),
          this.csvCell(this.dateLabel(o)),
          this.csvCell(this.timeLabel(o)),
          this.csvCell(this.locationLabel(o)),
          this.csvCell(this.statusLabel(o)),
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  trackByOrderId(_: number, item: Order): number {
    return item.orderId;
  }

  toggleActions(orderId: number): void {
    this.openActionsForOrderId = this.openActionsForOrderId === orderId ? null : orderId;
  }

  closeActions(): void {
    this.openActionsForOrderId = null;
  }

  canMarkCompleted(order: Order): boolean {
    const s = (order.status ?? '').toLowerCase();
    return s !== 'delivered' && s !== 'completed' && s !== 'canceled' && s !== 'cancelled';
  }

  canCancel(order: Order): boolean {
    const s = (order.status ?? '').toLowerCase();
    return s !== 'canceled' && s !== 'cancelled' && s !== 'delivered' && s !== 'completed';
  }

  markCompleted(order: Order): void {
    if (!this.canMarkCompleted(order)) return;
    order.status = 'delivered';
    order.deliveryDate = new Date().toISOString();
    this.closeActions();
  }

  cancelOrder(order: Order): void {
    if (!this.canCancel(order)) return;
    order.status = 'canceled';
    this.closeActions();
  }

  private getOrderTime(order: Order): number {
    const raw = order.orderDate ?? order.deliveryDate;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private csvCell(value: string): string {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  private titleCase(value: string): string {
    const s = value.trim();
    if (!s) return s;
    return s
      .split(/\s+/)
      .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
      .join(' ');
  }
}

type SortOrder = 'newest' | 'oldest';

type Order = {
  orderId: number;
  clientName?: string;
  orderDate?: string;
  deliveryDate?: string;
  status?: string;
  orderSource?: string;
  items?: Array<{ name?: string; category?: string }>;
  delivery?: {
    address?: string;
    driver?: { name?: string };
  };
};
