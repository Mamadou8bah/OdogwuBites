import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { DeliveryService } from '../service/delivery.service';
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
  readonly perAssignedOrderEarning = 50;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.fetchDeliveryDetails(this.id);
      }
    });
  }

  fetchDeliveryDetails(id: string): void {
    this.deliveryService.getDeliveryStaffById(id).subscribe({
      next: (staff: any) => {
        const assignedOrdersCount =
          Number(staff?.assignedOrdersCount ?? (Array.isArray(staff?.Orders) ? staff.Orders.length : 0)) || 0;
        const totalEarnings =
          Number(staff?.totalEarnings ?? assignedOrdersCount * this.perAssignedOrderEarning) || 0;

        this.delivery = {
          id: staff._id,
          employeeId: staff.employeeId, 
          name: staff.userId?.name, 
          email: staff.userId?.email,
          phone: staff.userId?.phone,
          balance: staff.userId?.balance,
          status: staff.status,
          hireDate: staff.hireDate,
          employmentType: staff.employmentType,
          vehicle: staff.vehicle,
          performance: {
            assignedOrdersCount,
            perAssignedOrderEarning: this.perAssignedOrderEarning,
            totalEarnings,
          },
          address: staff.userId?.address ? { street: staff.userId.address } : undefined,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.userId?.name || 'Driver'}`
        };
      },
      error: (err) => console.error('Error fetching delivery staff details:', err)
    });
  }

  vehicleSummary(): string {
    const v = this.delivery?.vehicle;
    if (!v) return '—';
    const parts = [v.year, v.make, v.model]
      .map((p: any) => (p == null ? '' : String(p).trim()))
      .filter((p: string) => p);
    return parts.join(' ') || '—';
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