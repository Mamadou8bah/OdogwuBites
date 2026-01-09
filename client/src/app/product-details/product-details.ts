import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPageService } from '../service/menu-page-service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  menuItem: any = null;
  isEditing: boolean = false;
  editForm: any = {};
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private menuService: MenuPageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.fetchMenuItem(id);
  }

  fetchMenuItem(id: string): void {
    this.menuService.getMenuItemById(id).subscribe({
      next: (data) => {
        this.menuItem = data;
        if (!this.menuItem) {
          this.router.navigate(['/dashboard/products']);
        }
      },
      error: () => this.router.navigate(['/dashboard/products'])
    });
  }

  close(): void {
    if (this.isEditing) {
      this.isEditing = false;
      this.selectedFileName = '';
      return;
    }
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/dashboard/products']);
  }

  goToProducts(): void {
    this.router.navigate(['/dashboard/products']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  editMenuItem(): void {
    if (this.menuItem) {
      this.editForm = { ...this.menuItem };
      this.selectedFileName = '';
      this.isEditing = true;
    }
  }

  saveChanges(): void {
    if (this.menuItem) {
      const formData = new FormData();
      formData.append('title', this.editForm.title);
      formData.append('description', this.editForm.description);
      formData.append('price', this.editForm.price.toString());
      formData.append('categoryName', this.editForm.categoryName);
      formData.append('isAvailable', this.editForm.isAvailable.toString());
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.menuService.updateMenuItem(this.menuItem._id, formData).subscribe({
        next: (data) => {
          this.menuItem = data.menuItem || data;
          this.isEditing = false;
          this.selectedFileName = '';
        },
        error: (err) => alert(err.error?.message || 'Update failed')
      });
    }
  }

  deleteMenuItem(): void {
    if (confirm('Are you sure you want to delete this menu item?')) {
      this.menuService.deleteMenuItem(this.menuItem._id).subscribe({
        next: () => this.router.navigate(['/dashboard/products']),
        error: (err) => alert(err.error?.message || 'Delete failed')
      });
    }
  }

  getDiscountedPrice(item: any): number {
    if (!item) return 0;
    if (!item.discount) return item.price;
    return item.price - (item.price * item.discount / 100);
  }
}