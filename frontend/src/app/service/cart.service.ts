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

  private didAttemptLocalToServerSync = false;

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

  private toQuantityMap(items: CartItem[]): Map<string, number> {
    const m = new Map<string, number>();
    for (const it of items) {
      if (!it.menuItemId) continue;
      m.set(String(it.menuItemId), (m.get(String(it.menuItemId)) || 0) + Math.max(1, Number(it.quantity || 1)));
    }
    return m;
  }

  refreshFromServer(): void {
    if (!localStorage.getItem('token')) return;

    
    const shouldSyncLocal = this.authService.isLoggedIn && !this.didAttemptLocalToServerSync;
    const localSnapshot = [...this._items];

    this.http.get<any>(`${this.apiUrl}/me`, { headers: this.getHeaders() })
      .pipe(catchError(() => of(null)))
      .subscribe((cart) => {
        if (!cart) return;

        // Attempt a one-time merge of local cart into server cart.
        if (shouldSyncLocal && localSnapshot.length > 0) {
          this.didAttemptLocalToServerSync = true;

          const serverItems = Array.isArray(cart?.items) ? cart.items : [];
          const serverMap = new Map<string, number>();
          for (const it of serverItems) {
            const id = String(it?.menuItem?._id ?? it?.menuItem ?? '');
            if (!id) continue;
            serverMap.set(id, (serverMap.get(id) || 0) + Math.max(1, Number(it?.quantity ?? 1)));
          }

          const localMap = this.toQuantityMap(localSnapshot);
          const adds: Array<{ id: string; qty: number }> = [];
          for (const [id, localQty] of localMap.entries()) {
            const serverQty = serverMap.get(id) || 0;
            const diff = localQty - serverQty;
            if (diff > 0) adds.push({ id, qty: diff });
          }

          if (adds.length > 0) {
            // Fire-and-forget sync; then refresh again to get canonical server cart.
            for (const a of adds) {
              this.http.post<any>(`${this.apiUrl}/add/${a.id}`, { quantity: a.qty }, { headers: this.getHeaders() })
                .pipe(catchError(() => of(null)))
                .subscribe();
            }

            this.http.get<any>(`${this.apiUrl}/me`, { headers: this.getHeaders() })
              .pipe(catchError(() => of(null)))
              .subscribe((fresh) => {
                if (fresh) this.setFromApiCart(fresh);
              });
            return;
          }
        }

        this.setFromApiCart(cart);
      });
  }

  toggleCart(): void {
    if(!this.isCustomer)return;
    this.isCartOpen = !this.isCartOpen;
  }

  openCart(): void {
    if(!this.isCustomer)return;
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  get isCustomer(){
    const user = this.authService.currentUserDetails;
    if (!user) return true; // Assume customer if not logged in, or change logic as needed.
    return user.role !== 'admin' && user.role !== 'staff';
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

    const existing = this._items.find(i => (menuItem._id ? i.menuItemId === menuItem._id : i.name === menuItem.title));
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
        menuItemId: menuItem._id,
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
