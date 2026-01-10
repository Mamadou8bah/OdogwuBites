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
  paginatedMenuItems: any[] = [];
  selectedCategory: string = 'All';
  searchInput: string = '';
  clickedMenuItem: any = null;
  isLoading: boolean = false;
  loadError: string | null = null;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor(private menuPageService: MenuPageService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.isLoading = true;
    this.loadError = null;
    this.menuPageService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.filterMenu();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load menu items', err);
        this.loadError = 'Failed to load menu items. Please try again.';
        this.isLoading = false;
      }
    });
  }

  toggleMenuDetails(item: any): void {
    this.clickedMenuItem = item;
  }

  toggleCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.filterMenu();
  }

  onSearchChange(): void {
    this.currentPage = 1;
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

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMenuItems.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMenuItems = this.filteredMenuItems.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
