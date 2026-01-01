import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem,sampleCartItems } from '../data/cartItems';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  standalone: true
})
export class Cart {
  cartItems: CartItem[] = [];
  isCartOpen: boolean = true;

  constructor() {
    this.cartItems = sampleCartItems;
  }

  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  closeCart():void{
    this.isCartOpen=false;
  }
  

}
