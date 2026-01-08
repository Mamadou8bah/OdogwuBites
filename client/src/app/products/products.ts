import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { menuItems } from '../data/menu-items';

@Component({
  selector: 'app-products',
  imports: [CommonModule,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  searchTerm: string = '';
  searchedProducts = menuItems;

  selectedCategory: string = 'All';

  currentPage: number = 1;
  pageSize: number = 10;


  onSearchTermChange(): void {
    const query = this.searchTerm.trim().toLowerCase();

    if(!query){
      return;
    }
    this.currentPage = 1;
    if (!query) {
      this.searchedProducts = menuItems;
      return;
    }else{
      this.searchedProducts = menuItems.filter(item =>{
        const nameText = (item.title ?? '').toLowerCase();
        const categoryText = (item.categoryName ?? '').toLowerCase();
        return (
          nameText.includes(query) ||
          categoryText.includes(query)
        );
      })
      ;
    }

    
  }

  onFilterByCategory(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters():void{
    const query = this.searchTerm.trim().toLowerCase();
  
    this.searchedProducts = menuItems.filter(item => {
     
      const matchesSearch = item.title.toLowerCase().includes(query);
    
      const matchesCategory = this.selectedCategory === 'All' || 
                              item.categoryName === this.selectedCategory;

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
    // Intentionally empty: UI-only button for now.
  }

  getTotalPages():Number{
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
    this.currentPage = page;
  }
}
