import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { deliveryPersonnel } from '../data/delivery';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-delivery-details',
  standalone: true, 
  imports: [CommonModule, RouterLink],
  templateUrl: './delivery-details.html',
  styleUrl: './delivery-details.css',
})
export class DeliveryDetails implements OnInit {
  id: string | null = null;
  delivery: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.delivery = this.id
        ? deliveryPersonnel.find((person: any) => (person?.id ?? '').toString() === this.id)
        : undefined;
    });
  }

  
  get safeMapUrl(): SafeResourceUrl | null {
    const loc = this.delivery?.lastLocation;
    if (loc?.lat != null && loc?.lng != null) {
      const url = `https://maps.google.com/maps?q=${encodeURIComponent(`${loc.lat},${loc.lng}`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    const address = this.delivery?.address;
    if (!address) return null;

    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
    ].filter((p: any) => typeof p === 'string' && p.trim());

    const fullAddress = parts.join(', ');
    if (!fullAddress) return null;

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  statusLabel(): string {
    const s = (this.delivery?.status ?? '').toString().toLowerCase();
    if (!s) return '—';
    if (s === 'active' || s === 'on_delivery') return 'Online';
    if (s === 'on_break') return 'On break';
    if (s === 'off_duty' || s === 'suspended') return 'Offline';
    return this.titleCase(s.replace(/_/g, ' '));
  }

  private titleCase(value: string): string {
    const s = (value ?? '').trim();
    if (!s) return s;
    return s
      .split(/\s+/)
      .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
      .join(' ');
  }
}