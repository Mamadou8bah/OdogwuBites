import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageService } from '../service/homepage';
import { CartService } from '../service/cart.service';
import { MenuDetails } from '../menu-details/menu-details';
import { Subscription, catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, MenuDetails],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit, OnDestroy {
  menuItems: Array<any> = [];
  firstMenuItems: Array<any> = [];
  favoriteItems: Array<any> = [];
  selectedMenuItems: Array<any> = [];
  selectedCategory: string = 'All';
  clickedMenuItem: any = null;
  isLoading: boolean = false;
  loadError: string | null = null;

  private loadSubscription?: Subscription;

  constructor(
    private homepageService: HomepageService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  loadData(): void {
    if (this.isLoading && this.loadSubscription) {
      return; // Already loading
    }

    this.loadSubscription?.unsubscribe();
    this.isLoading = true;
    this.loadError = null;

    this.loadSubscription = this.homepageService
      .getMenuItems()
      .pipe(
        catchError((err) => {
          console.error('Homepage load error:', err);
          this.loadError = 'Failed to load menu items. Please try again.';
          return of([] as any[]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((items) => {
        // Map categoryName from populated categoryId
        const mappedItems = (items || []).map((item: any) => ({
          ...item,
          categoryName: item.categoryId?.name || item.categoryName || 'Uncategorized'
        }));

        this.menuItems = mappedItems;
        this.firstMenuItems = mappedItems.slice(0, 4);
        this.selectedMenuItems = mappedItems.slice(0, 6);
        this.favoriteItems = [...mappedItems]
          .sort((a, b) => (b?.rating || 0) - (a?.rating || 0))
          .slice(0, 4);
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

  get isCustomer(){
    return this.cartService.isCustomer;
  }

  
}
