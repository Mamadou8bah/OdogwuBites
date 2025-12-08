import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuPageService } from '../service/menu-page-service';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-page.html',
  styleUrls: ['./menu-page.css'],
})
export class MenuPage implements OnInit {

  filteredMenuItems: any[] = [];
  selectedCategory: string = 'All';
  searchInput: string = '';

  constructor(private menuPageService: MenuPageService) {}

  ngOnInit(): void {
    this.filterMenu();
  }

  toggleCategory(category: string): void {
    this.selectedCategory = category;
    this.filterMenu();
  }

  onSearchChange(): void {
    this.filterMenu();
  }

  private filterMenu(): void {
    let items = this.menuPageService.getMenuItems();

    
    if (this.selectedCategory !== 'All') {
      items = items.filter(
        item => item.categoryName === this.selectedCategory
      );
    }

    
    const search = this.searchInput.toLowerCase();

    this.filteredMenuItems = items.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  }
}
