import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CartService } from '../service/cart.service';

type MenuItem = {
  _id?: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
  rating?: number;
  isAvailable?: boolean;
  discount?: number;
};
 
@Component({
  selector: 'app-menu-details',
  imports: [CommonModule],
  templateUrl: './menu-details.html',
  styleUrl: './menu-details.css',
})
export class MenuDetails {

  @Input() menuItem: MenuItem | null = null;
  @Output() closed = new EventEmitter<void>();

  quantity = 1;

  constructor(private cartService: CartService) {}

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.closed.emit();
  }

  decrement(): void {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  increment(): void {
    this.quantity = Math.min(99, this.quantity + 1);
  }

  addToCart(): void {
    if (!this.menuItem || !this.isAvailable) return;
    this.cartService.addMenuItem(this.menuItem, this.quantity);
    this.close();
  }

  get isAvailable(): boolean {
    return this.menuItem?.isAvailable !== false;
  }

  get hasDiscount(): boolean {
    return (this.menuItem?.discount ?? 0) > 0;
  }

  get originalPrice(): number {
    return this.menuItem?.price ?? 0;
  }

  get displayPrice(): number {
    const price = this.originalPrice;
    const discountRaw = this.menuItem?.discount ?? 0;
    const discount = Math.min(100, Math.max(0, discountRaw));
    if (!discount) return price;
    return Math.max(0, Math.round(price * (1 - discount / 100)));
  }

  get savingsPerItem(): number {
    return this.hasDiscount ? Math.max(0, this.originalPrice - this.displayPrice) : 0;
  }

  get savingsTotal(): number {
    return this.savingsPerItem * this.quantity;
  }

  get lineTotal(): number {
    return this.displayPrice * this.quantity;
  }

  get isCustomer(){
    return this.cartService.isCustomer;
  }
}
