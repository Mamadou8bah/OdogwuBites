import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem } from '../data/cartItems';
import { AuthService } from './auth.service';
import { catchError, of } from 'rxjs';

export type MenuItemLike = {
  _id?: string;
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
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient, private authService: AuthService) {
    if (localStorage.getItem('token')) {
      this.refreshFromServer();
    }
  }

  get items(): CartItem[] {
    return this._items;
  }

  get totalPrice(): number {
    return this._items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private setFromApiCart(cart: any): void {
    const items = Array.isArray(cart?.items) ? cart.items : [];
    this._items = items.map((it: any, idx: number) => {
      const menuItem = it.menuItem;
      const menuItemId = menuItem?._id ?? menuItem;
      return {
        id: idx + 1,
        menuItemId,
        name: menuItem?.title ?? 'Item',
        price: Number(menuItem?.price ?? it.price ?? 0),
        quantity: Number(it.quantity ?? 1),
        category: 'Menu',
        imageUrl: menuItem?.imageUrl,
      } as CartItem;
    });
  }

  refreshFromServer(): void {
    if (!this.authService.isLoggedIn || !localStorage.getItem('token')) return;

    this.http.get<any>(`${this.apiUrl}/me`, { headers: this.getHeaders() })
      .pipe(catchError(() => of(null)))
      .subscribe((cart) => {
        if (cart) this.setFromApiCart(cart);
      });
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

    // If we have an authenticated user and a backend id, sync to server.
    if (this.authService.isLoggedIn && menuItem._id) {
      this.http.post<any>(`${this.apiUrl}/add/${menuItem._id}`, { quantity: normalizedQuantity }, { headers: this.getHeaders() })
        .pipe(catchError(() => of(null)))
        .subscribe((cart) => {
          if (cart) this.setFromApiCart(cart);
          this.openCart();
        });
      return;
    }

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
    const item = this._items.find(i => i.id === itemId);
    if (this.authService.isLoggedIn && item?.menuItemId) {
      this.http.post<any>(`${this.apiUrl}/add/${item.menuItemId}`, { quantity: 1 }, { headers: this.getHeaders() })
        .pipe(catchError(() => of(null)))
        .subscribe((cart) => {
          if (cart) this.setFromApiCart(cart);
        });
      return;
    }

    this._items = this._items.map(i => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
  }

  decrement(itemId: number): void {
    const item = this._items.find(i => i.id === itemId);
    if (this.authService.isLoggedIn && item?.menuItemId) {
      this.http.post<any>(`${this.apiUrl}/remove/${item.menuItemId}`, { quantity: 1 }, { headers: this.getHeaders() })
        .pipe(catchError(() => of(null)))
        .subscribe((cart) => {
          if (cart) this.setFromApiCart(cart);
        });
      return;
    }

    this._items = this._items
      .map(i => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter(i => i.quantity >= 1);
  }

  remove(itemId: number): void {
    const item = this._items.find(i => i.id === itemId);
    if (this.authService.isLoggedIn && item?.menuItemId) {
      const qty = Math.max(1, item.quantity);
      this.http.post<any>(`${this.apiUrl}/remove/${item.menuItemId}`, { quantity: qty }, { headers: this.getHeaders() })
        .pipe(catchError(() => of(null)))
        .subscribe((cart) => {
          if (cart) this.setFromApiCart(cart);
        });
      return;
    }

    this._items = this._items.filter(i => i.id !== itemId);
  }

  clear(): void {
    if (this.authService.isLoggedIn && localStorage.getItem('token')) {
      this.http.post<any>(`${this.apiUrl}/clear`, {}, { headers: this.getHeaders() })
        .pipe(catchError(() => of(null)))
        .subscribe((cart) => {
          if (cart) this.setFromApiCart(cart);
          else this._items = [];
        });
      return;
    }

    this._items = [];
  }
}
