import { Injectable } from '@angular/core';
import { CartItem } from '../data/cartItems';

export type MenuItemLike = {
  title: string;
  price: number;
  categoryName?: string;
  imageUrl?: string;
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items: CartItem[] = [];
  public isCartOpen: boolean = false;

  get items(): CartItem[] {
    return this._items;
  }

  get totalPrice(): number {
    return this._items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  addMenuItem(menuItem: MenuItemLike, quantity: number = 1): void {
    const normalizedQuantity = Math.max(1, Math.floor(quantity || 1));

    const existing = this._items.find(i => i.name === menuItem.title);
    if (existing) {
      existing.quantity += normalizedQuantity;
      this.openCart();
      return;
    }

    const nextId = this._items.length > 0 ? Math.max(...this._items.map(i => i.id)) + 1 : 1;

    this._items = [
      ...this._items,
      {
        id: nextId,
        name: menuItem.title,
        price: menuItem.price,
        quantity: normalizedQuantity,
        category: menuItem.categoryName ?? 'Menu',
        imageUrl: menuItem.imageUrl,
      },
    ];
    this.openCart();
  }

  increment(itemId: number): void {
    this._items = this._items.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  decrement(itemId: number): void {
    this._items = this._items
      .map(item => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
      .filter(item => item.quantity >= 1);
  }

  remove(itemId: number): void {
    this._items = this._items.filter(item => item.id !== itemId);
  }

  clear(): void {
    this._items = [];
  }
}
