import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Homepage as HomepageService } from '../service/homepage';
import { CartService } from '../service/cart.service';
import { MenuDetails } from '../menu-details/menu-details';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, MenuDetails],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  menuItems: Array<any> = [];
  firstMenuItems: Array<any> = [];
  favoriteItems: Array<any> = [];
  selectedMenuItems: Array<any> = [];
  selectedCategory: string = 'All';
  clickedMenuItem: any = null;
  isLoading: boolean = false;

  constructor(
    private homepageService: HomepageService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.homepageService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.firstMenuItems = items.slice(0, 4);
        this.selectedMenuItems = items.slice(0, 6);
        this.isLoading = true;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

    this.homepageService.getFavoriteItems().subscribe({
      next: (items) => this.favoriteItems = items,
      error: (err) => console.error(err)
    });
  }

  toggleCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.selectedMenuItems = this.menuItems.slice(0, 6);
    } else {
      this.selectedMenuItems = this.menuItems.filter(item => item.categoryName === category).slice(0, 6);
    } 
  }

  addToCart(menuItem: any, quantity: number = 1): void {
    if (!menuItem) return;
    if (menuItem.isAvailable === false) return;
    this.cartService.addMenuItem(menuItem, quantity);
  }

  toggleMenuDetails(item: any): void {
    this.clickedMenuItem = item;
  }

  
}
