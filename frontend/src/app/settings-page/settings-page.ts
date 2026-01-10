import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css'
})
export class SettingsPage implements OnInit {
  user: any = null;
  activeTab: string = 'edit-profile';
  editableFields: { [key: string]: boolean } = {};

  isLoading = false;
  loadError: string | null = null;
  isSaving = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Show whatever we have immediately (may be partial), then refresh from API.
    const cached = this.authService.currentUserDetails;
    if (cached) {
      this.user = { ...cached };
    }

    this.isLoading = true;
    this.loadError = null;
    this.authService
      .getProfile()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (profile) => {
          this.user = { ...profile };
        },
        error: () => {
          this.loadError = 'Failed to load your profile. Please try again.';
        },
      });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleEdit(field: string) {
    this.editableFields[field] = !this.editableFields[field];
  }

  saveSettings() {
    if (!this.user || this.isSaving) return;
    this.isSaving = true;

    const payload = {
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
    };

    this.authService
      .updateProfile(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          alert('Settings saved successfully!');
          this.editableFields = {};
          // Refresh local copy from whatever AuthService stored.
          const updated = this.authService.currentUserDetails;
          if (updated) this.user = { ...updated };
        },
        error: (err) => {
          alert('Failed to save settings: ' + (err.error?.message || 'Unknown error'));
        },
      });
  }
}
