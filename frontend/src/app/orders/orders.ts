import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: Order[] = [];
  searchTerm = '';
  sortOrder: SortOrder = 'newest';
  pageSize = 10;
  currentPage = 1;
  openActionsForOrderId: string | null = null;
  selectedIds = new Set<string>();
  loading = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    const user = this.authService.currentUser;
    if (!user) {
      this.loading = false;
      return;
    }

    const role = (user.role ?? '').toString().toLowerCase();

    const request = role === 'admin'
      ? this.orderService.getAllOrders()
      : role === 'staff'
        ? this.orderService.getMyAssignedOrders()
        : this.orderService.getOrdersByUserId(user._id);

    request.subscribe({
      next: (data: any[]) => {
        this.orders = data.map(o => ({
          ...o,
          orderId: o._id,
          clientName: o.user?.name || 'Unknown',
          delivery: {
            address: o.address,
            driver: { name: o.deliveryStaff?.fullname || 'Unassigned' }
          }
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

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

  isSelected(orderId: string): boolean {
    return this.selectedIds.has(orderId);
  }

  toggleSelected(orderId: string, checked: boolean): void {
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
    const first = order.items?.[0];
    const fromItem = first?.category ?? first?.name ?? (first as any)?.title;
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
    return 'border-white/10 bg-[#292927] text-gray-300';
  }

  trackByOrderId(_: number, item: Order): string {
    return item.orderId;
  }

  toggleActions(orderId: string): void {
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
    this.orderService.deliverOrder(String(order.orderId)).subscribe({
      next: () => {
        order.status = 'Delivered';
        this.closeActions();
      },
      error: (err) => console.error(err)
    });
  }

  cancelOrder(order: Order): void {
    if (!this.canCancel(order)) return;
    this.orderService.cancelOrder(String(order.orderId)).subscribe({
      next: () => {
        order.status = 'Cancelled';
        this.closeActions();
      },
      error: (err) => console.error(err)
    });
  }

  private getOrderTime(order: Order): number {
    const raw = order.orderDate ?? order.deliveryDate ?? order.createdAt;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
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
  orderId: string;
  clientName?: string;
  orderDate?: string;
  deliveryDate?: string;
  createdAt?: string;
  status?: string;
  orderSource?: string;
  items?: Array<{ name?: string; category?: string }>;
  delivery?: {
    address?: string;
    driver?: { name?: string };
  };
};
