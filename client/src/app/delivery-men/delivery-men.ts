import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DeliveryService } from '../service/delivery.service';

@Component({
  selector: 'app-delivery-men',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './delivery-men.html',
  styleUrl: './delivery-men.css',
})
export class DeliveryMen implements OnInit {
  protected deliveryMen: DeliveryPerson[] = [];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.refreshDeliveryMen();
  }

  refreshDeliveryMen(): void {
    this.deliveryService.getAllDeliveryStaff().subscribe({
      next: (staff: any[]) => {
        this.deliveryMen = staff.map(s => ({
          id: s._id,
          employeeId: s.employeeId,
          name: s.userId?.name,
          email: s.userId?.email,
          phone: s.userId?.phone,
          status: s.status || 'active',
          employmentType: s.employmentType || 'full_time',
          hireDate: s.hireDate,
          assignedOrdersCount: Number(s.assignedOrdersCount ?? (Array.isArray(s.Orders) ? s.Orders.length : 0)) || 0,
          totalEarnings: Number(s.totalEarnings) || 0,
          address: s.userId?.address ? { street: s.userId.address } : undefined,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.userId?.name || 'Driver'}`,
          vehicle: s.vehicle ? {
            type: s.vehicle.type,
            make: s.vehicle.make,
            model: s.vehicle.model,
            year: s.vehicle.year,
            licensePlate: s.vehicle.licensePlate
          } : {
            type: 'motorcycle',
            make: '',
            model: '',
            year: undefined,
            licensePlate: ''
          }
        }));
      },
      error: (err) => console.error('Error fetching delivery staff:', err)
    });
  }

  searchTerm = '';
  sortOrder: SortOrder = 'newest';

  pageSize = 10; 
  currentPage = 1;

  private readonly selectedIds = new Set<string>();
  isAddModalOpen = false;
  isEditing = false;
  selectedDriverId: string | null = null;

  newDeliveryMan: any = {
    name: '',
    email: '',
    phone: '',
    status: 'active',
    employmentType: 'full_time',
    vehicle: {
      type: 'motorcycle',
      make: '',
      model: '',
      year: undefined,
      licensePlate: ''
    },
    address: {
      street: '',
      city: '',
      state: 'NY',
      zip: ''
    }
  };

  get filteredDeliveryMen(): DeliveryPerson[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.deliveryMen;

    return this.deliveryMen.filter((d) => {
      const idText = (d.id ?? '').toLowerCase();
      const nameText = (d.name ?? '').toLowerCase();
      const emailText = (d.email ?? '').toLowerCase();
      const phoneText = (d.phone ?? '').toLowerCase();
      const addressText = this.addressLabel(d).toLowerCase();
      const statusText = (d.status ?? '').toLowerCase();

      return (
        idText.includes(query) ||
        nameText.includes(query) ||
        emailText.includes(query) ||
        phoneText.includes(query) ||
        addressText.includes(query) ||
        statusText.includes(query)
      );
    });
  }

  get sortedDeliveryMen(): DeliveryPerson[] {
    const copy = [...this.filteredDeliveryMen];
    copy.sort((a, b) => {
      const aTime = this.getHireTime(a);
      const bTime = this.getHireTime(b);
      return this.sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return copy;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedDeliveryMen.length / this.pageSize));
  }

  get visibleDeliveryMen(): DeliveryPerson[] {
    const safePage = Math.min(Math.max(1, this.currentPage), this.totalPages);
    const start = (safePage - 1) * this.pageSize;
    return this.sortedDeliveryMen.slice(start, start + this.pageSize);
  }

  get pageButtons(): Array<number | '…'> {
    const total = this.totalPages;
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    return [1, 2, 3, 4, '…', total];
  }

  onSearchTermChange(): void {
    this.currentPage = 1;
  }

  onSortOrderChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }

  goPrev(): void {
    this.goToPage(this.currentPage - 1);
  }

  goNext(): void {
    this.goToPage(this.currentPage + 1);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleSelected(id: string, checked: boolean): void {
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }

  isAllVisibleSelected(): boolean {
    const visible = this.visibleDeliveryMen;
    return visible.length > 0 && visible.every((d) => this.selectedIds.has(d.id));
  }

  toggleAllVisible(checked: boolean): void {
    for (const d of this.visibleDeliveryMen) {
      if (checked) this.selectedIds.add(d.id);
      else this.selectedIds.delete(d.id);
    }
  }

  addressLabel(driver: DeliveryPerson): string {
    const a = driver.address;
    if (!a) return '—';
    const city = a.city?.trim();
    const street = a.street?.trim();
    if (city && street) return `${street}, ${city}`;
    return city || street || '—';
  }

  statusLabel(driver: DeliveryPerson): string {
    const s = (driver.status ?? '').toLowerCase();
    if (!s) return '—';
    if (s === 'active' || s === 'on_delivery') return 'Online';
    if (s === 'on_break') return 'On break';
    if (s === 'off_duty') return 'Offline';
    if (s === 'suspended') return 'Offline';
    return this.titleCase(s.replace(/_/g, ' '));
  }

  statusTextClass(driver: DeliveryPerson): string {
    const s = (driver.status ?? '').toLowerCase();
    if (s === 'active' || s === 'on_delivery') return 'text-green-400';
    if (s === 'on_break') return 'text-orange-300';
    if (s === 'off_duty' || s === 'suspended') return 'text-red-400';
    return 'text-gray-300';
  }

  addDeliveryMan(): void {
    this.isEditing = false;
    this.selectedDriverId = null;
    this.isAddModalOpen = true;
    this.resetNewDeliveryMan();
  }

  editDeliveryMan(driver: any): void {
    this.isEditing = true;
    this.selectedDriverId = driver.id;
    this.newDeliveryMan = JSON.parse(JSON.stringify(driver)); // Deep copy
    // Ensure nested objects exist if missing
    if (!this.newDeliveryMan.vehicle) this.newDeliveryMan.vehicle = {};
    if (!this.newDeliveryMan.address) this.newDeliveryMan.address = {};
    this.isAddModalOpen = true;
  }

  deleteDeliveryMan(driver: any): void {
    if (confirm(`Are you sure you want to remove ${driver.name}?`)) {
      this.deliveryService.deleteDeliveryStaff(driver.id).subscribe({
        next: () => {
          this.refreshDeliveryMen();
          this.selectedIds.delete(driver.id);
        },
        error: (err) => console.error('Error deleting delivery staff:', err)
      });
    }
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  resetNewDeliveryMan(): void {
    this.newDeliveryMan = {
      name: '',
      email: '',
      phone: '',
      status: 'active',
      employmentType: 'full_time',
      vehicle: {
        type: 'motorcycle',
        make: '',
        model: '',
        year: undefined,
        licensePlate: ''
      },
      address: {
        street: '',
        city: '',
        state: 'NY',
        zip: ''
      }
    };
  }

  saveDeliveryMan(): void {
    if (this.newDeliveryMan.email) {
      if (this.isEditing && this.selectedDriverId) {
        const updateData = {
          status: this.newDeliveryMan.status,
          employmentType: this.newDeliveryMan.employmentType,
          vehicleType: this.newDeliveryMan.vehicle?.type,
          vehicleMake: this.newDeliveryMan.vehicle?.make,
          vehicleModel: this.newDeliveryMan.vehicle?.model,
          vehicleYear: this.newDeliveryMan.vehicle?.year,
          vehicleLicensePlate: this.newDeliveryMan.vehicle?.licensePlate
        };
        this.deliveryService.updateDeliveryStaff(this.selectedDriverId, updateData).subscribe({
          next: () => {
            this.refreshDeliveryMen();
            this.closeAddModal();
          },
          error: (err) => console.error('Error updating delivery staff:', err)
        });
      } else {
        this.deliveryService.createDeliveryStaff(this.newDeliveryMan.email).subscribe({
          next: () => {
            this.refreshDeliveryMen();
            this.closeAddModal();
          },
          error: (err) => {
            console.error('Error adding delivery staff:', err);
            alert(err.error?.message || 'Error adding delivery staff. Make sure the user exists.');
          }
        });
      }
    }
  }

  trackById(_: number, item: DeliveryPerson): string {
    return item.id;
  }

  private getHireTime(driver: DeliveryPerson): number {
    const raw = driver.hireDate;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private titleCase(value: string): string {
    const s = value.trim();
    if (!s) return s;
    return s
      .split(/\s+/)
      .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
      .join(' ');
  }
}

type SortOrder = 'newest' | 'oldest';

type DeliveryAddress = {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

type DeliveryPerson = {
  id: string;
  employeeId?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  employmentType?: string;
  hireDate?: string;
  assignedOrdersCount?: number;
  totalEarnings?: number;
  address?: DeliveryAddress;
  vehicle?: {
    type?: string;
    make?: string;
    model?: string;
    licensePlate?: string;
  };
};
