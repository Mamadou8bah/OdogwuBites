import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuPageService } from '../service/menu-page-service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit { 
  searchTerm: string = '';
  searchedProducts: any[] = [];
  allProducts: any[] = [];

  isLoading = false;
  loadError: string | null = null;
  isSaving = false;

  selectedCategory: string = 'all';

  currentPage: number = 1;
  pageSize: number = 10;

  showAddModal: boolean = false;
  selectedFileName: string = '';
  isEditing: boolean = false;
  editingProduct: any = null;
  selectedFile: File | null = null;

  newProduct: any = {
    title: '',
    description: '',
    price: 0,
    categoryName: '',
    isAvailable: true
  };

  constructor(private menuService: MenuPageService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.loadError = null;

    this.menuService
      .getMenuItems()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
      next: (data) => {
        // Server returns category as populated `categoryId`; keep a convenient `categoryName` for UI.
        this.allProducts = (data || []).map((item: any) => ({
          ...item,
          categoryName: item?.categoryId?.name ?? item?.categoryName ?? '',
        }));
        this.applyFilters();
      },
      error: (err) => {
        console.error(err);
        this.loadError = err?.error?.message || 'Failed to load products';
        this.allProducts = [];
        this.searchedProducts = [];
      }
    });
  }

  get categories(): string[] {
    const unique = new Set<string>();
    for (const item of this.allProducts) {
      const name = item.categoryName;
      if (name) unique.add(name);
    }
    return Array.from(unique);
  }

  onSearchTermChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterByCategory(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const query = this.searchTerm.toLowerCase();
    this.searchedProducts = this.allProducts.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(query) || 
                          item.categoryName.toLowerCase().includes(query);
      const matchesCategory = this.selectedCategory === 'all' || 
                            item.categoryName === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  addMenuItem(): void {
    this.isEditing = false;
    this.resetForm();
    this.showAddModal = true;
  }

  editProduct(product: any): void {
    this.isEditing = true;
    this.editingProduct = product;
    this.newProduct = { ...product };
    this.showAddModal = true;
  }

  deleteProduct(product: any): void {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      this.isSaving = true;
      this.menuService
        .deleteMenuItem(product._id)
        .pipe(finalize(() => (this.isSaving = false)))
        .subscribe({
          next: () => this.fetchProducts(),
          error: (err) => alert(err.error?.message || 'Delete failed')
        });
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.selectedFileName = '';
    this.selectedFile = null;
    this.isEditing = false;
    this.editingProduct = null;
    this.resetForm();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  resetForm(): void {
    this.newProduct = {
      title: '',
      description: '',
      price: 0,
      categoryName: '',
      isAvailable: true
    };
  }

  saveProduct(): void {
    if (!this.isEditing && !this.selectedFile) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newProduct.title);
    formData.append('description', this.newProduct.description);
    formData.append('price', this.newProduct.price.toString());
    formData.append('categoryName', this.newProduct.categoryName);
    formData.append('isAvailable', this.newProduct.isAvailable.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    console.log('Submitting form data:', this.newProduct, this.selectedFile);
    const request = this.isEditing 
      ? this.menuService.updateMenuItem(this.editingProduct._id, formData)
      : this.menuService.createMenuItem(formData);

    this.isSaving = true;
    request
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.fetchProducts();
          this.closeModal();
        },
        error: (err) => alert(typeof err.error === 'string' ? err.error : (err.error?.message || 'Save failed'))
      });
  }

  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.searchedProducts.length / this.pageSize));
  }

  getVisibleProducts(): any[] {
    const safePage = Math.min(Math.max(1, this.currentPage), this.getTotalPages());
    const start = (safePage - 1) * this.pageSize;
    return this.searchedProducts.slice(start, start + this.pageSize);
  }

  getPageButtons(): Array<number | '…'> {
    const total = this.getTotalPages();
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    return [1, 2, 3, 4, '…', total];
  }

  goPrev(): void {
    this.goToPage(this.currentPage - 1);
  }

  goNext(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToPage(page: number | '…'): void {
    if (page === '…') return;
    this.currentPage = Math.min(Math.max(1, page), this.getTotalPages());
  }
}
