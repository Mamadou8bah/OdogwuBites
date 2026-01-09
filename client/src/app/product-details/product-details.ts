import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { menuItems } from '../data/menu-items';

type MenuItem = (typeof menuItems)[number];

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  menuItem: MenuItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.menuItem = this.findBySlug(slug);

    if (!this.menuItem) {
      this.router.navigate(['/dashboard/products']);
    }
  }

  close(): void {
    // Prefer going back (so it behaves like a modal), fallback to products list.
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/dashboard/products']);
  }

  goToProducts(): void {
    this.router.navigate(['/dashboard/products']);
  }

  getDiscountedPrice(item: MenuItem): number {
    if (!item.discount) return item.price;
    return item.price - (item.price * item.discount / 100);
  }

  private findBySlug(slug: string): MenuItem | null {
    const normalized = (slug ?? '').trim().toLowerCase();
    if (!normalized) return null;

    const match = menuItems.find((item) => this.toSlug(item.title) === normalized);
    return match ?? null;
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
