import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../data/cartItems';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  standalone: true
})
export class Cart {
  isCartOpen: boolean = true;

  constructor(private cartService: CartService) {}

  get cartItems(): CartItem[] {
    return this.cartService.items;
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }
  closeCart():void{
    this.isCartOpen=false;
  }

  increment(itemId: number): void {
    this.cartService.increment(itemId);
  }

  decrement(itemId: number): void {
    this.cartService.decrement(itemId);
  }

  remove(itemId: number): void {
    this.cartService.remove(itemId);
  }
  

}
