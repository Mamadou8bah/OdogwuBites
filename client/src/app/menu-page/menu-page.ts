import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuPageService } from '../service/menu-page-service';
import { MenuDetails } from '../menu-details/menu-details';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuDetails],
  templateUrl: './menu-page.html',
  styleUrls: ['./menu-page.css'],
})
export class MenuPage implements OnInit {
  menuItems: any[] = [];
  filteredMenuItems: any[] = [];
  selectedCategory: string = 'All';
  searchInput: string = '';
  clickedMenuItem: any = null;
  isLoading: boolean = false;

  constructor(private menuPageService: MenuPageService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.isLoading = true;
    this.menuPageService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.filterMenu();
        this.isLoading=true;
      },
      error: (err) => console.error('Failed to load menu items', err)
    });
  }

  toggleMenuDetails(item: any): void {
    this.clickedMenuItem = item;
  }

  toggleCategory(category: string): void {
    this.selectedCategory = category;
    this.filterMenu();
  }

  onSearchChange(): void {
    this.filterMenu();
  }

  private filterMenu(): void {
    let items = [...this.menuItems];

    if (this.selectedCategory !== 'All') {
      items = items.filter(
        item => item.categoryName === this.selectedCategory
      );
    }

    const search = this.searchInput.toLowerCase();
    this.filteredMenuItems = items.filter(item =>
      item.title.toLowerCase().includes(search) ||
      (item.description && item.description.toLowerCase().includes(search))
    );
  }
}
