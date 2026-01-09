import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { menuItems } from '../data/menu-items';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  searchTerm: string = '';
  searchedProducts = menuItems;

  selectedCategory: string = 'all';

  currentPage: number = 1;
  pageSize: number = 10;

  showAddModal: boolean = false;
  selectedFileName: string = '';
  isEditing: boolean = false;
  editingProductIndex: number = -1;

  newProduct: any = {
    title: '',
    description: '',
    price: 0,
    categoryName: '',
    imageUrl: '',
    isAvailable: true
  };

  get categories(): string[] {
    const unique = new Set<string>();
    for (const item of menuItems) {
      const name = (item as any)?.categoryName;
      if (typeof name === 'string' && name.trim()) unique.add(name.trim());
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }

  onSearchTermChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterByCategory(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters():void{
    const query = this.searchTerm.trim().toLowerCase();
    const selected = (this.selectedCategory ?? 'all').trim();

    this.searchedProducts = menuItems.filter((item: any) => {
      const titleText = (item?.title ?? '').toString().toLowerCase();
      const categoryText = (item?.categoryName ?? '').toString().toLowerCase();

      const matchesSearch = !query || titleText.includes(query) || categoryText.includes(query);
      const matchesCategory = selected === 'all' || (item?.categoryName ?? '') === selected;
      return matchesSearch && matchesCategory;
    });
  }
  exportVisibleToCsv(): void {
    const rows = this.getVisibleProducts();
    const headers=["Image","Name","Price","Category","Status"];
    const csvContent = [
      headers.join(','),
      ...rows.map(item => [
        `"${item.imageUrl}"`,
        `"${item.title}"`,
        `"${item.price}"`,
        `"${item.categoryName}"`,
        `"${item.isAvailable ? 'Available' : 'Unavailable'}"`
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  addMenuItem(): void {
    this.isEditing = false;
    this.showAddModal = true;
  }

  editProduct(product: any): void {
    this.isEditing = true;
    this.editingProductIndex = menuItems.indexOf(product);
    this.newProduct = { ...product };
    this.selectedFileName = ''; // Or handling if we want to show existing name
    this.showAddModal = true;
  }

  deleteProduct(product: any): void {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      const index = menuItems.indexOf(product);
      if (index > -1) {
        menuItems.splice(index, 1);
        this.applyFilters();
      }
    }
  }

  closeModal(): void {
    this.showAddModal = false;
    this.selectedFileName = '';
    this.isEditing = false;
    this.editingProductIndex = -1;
    this.resetForm();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.newProduct.imageUrl = URL.createObjectURL(file);
    }
  }

  resetForm(): void {
    this.newProduct = {
      title: '',
      description: '',
      price: 0,
      categoryName: '',
      imageUrl: '',
      isAvailable: true
    };
  }

  saveProduct(): void {
    if (this.newProduct.title && this.newProduct.price) {
      if (this.isEditing && this.editingProductIndex > -1) {
        menuItems[this.editingProductIndex] = {
          ...this.newProduct,
          updatedAt: new Date().toISOString()
        };
        console.log('Product updated:', this.newProduct);
      } else {
        const productToSave = {
          ...this.newProduct,
          createdAt: new Date().toISOString(),
          rating: 0
        };
        menuItems.unshift(productToSave);
        console.log('New product added:', productToSave);
      }
      
      this.applyFilters();
      this.closeModal();
    }
  }

  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.searchedProducts.length / this.pageSize));
  }

  getVisibleProducts():any[]{
    const safePage = Math.min(Math.max(1, this.currentPage), this.getTotalPages() as number);
    const start = (safePage - 1) * this.pageSize;
    return this.searchedProducts.slice(start, start + this.pageSize);
  }

  getPageButtons(): Array<number | '…'> {
    const totalPages = this.getTotalPages() as number;

    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3,4, '…', totalPages];
  }
  onSortOrderChange(): void {
    this.currentPage = 1;
  }

  goNext():void{
    if(this.currentPage < (this.getTotalPages() as number)){
      this.currentPage +=1;
    }
  }
  goPrev():void{
    if(this.currentPage >1){
      this.currentPage -=1;
    }
  }

  goToPage(page:any):void{
    if (typeof page !== 'number') return;
    this.currentPage = Math.min(Math.max(1, page), this.getTotalPages() as number);
  }

  productSlug(product: any): string {
    return this.toSlug(product?.title ?? '');
  }

  private toSlug(value: string): string {
    return (value ?? '')
      .trim()
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
