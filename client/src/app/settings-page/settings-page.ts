import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css'
})
export class SettingsPage implements OnInit {
  user: any = {};
  activeTab: string = 'edit-profile';
  editableFields: { [key: string]: boolean } = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.user = { ...currentUser };
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleEdit(field: string) {
    this.editableFields[field] = !this.editableFields[field];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveSettings() {
    this.authService.updateProfile(this.user).subscribe({
      next: (res) => {
        alert('Settings saved successfully!');
        this.editableFields = {};
      },
      error: (err) => {
        alert('Failed to save settings: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
