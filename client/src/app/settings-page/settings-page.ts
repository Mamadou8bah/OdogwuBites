import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css'
})
export class SettingsPage {
  user = {
    name: 'Admin',
    email: 'Admin@gmail.com',
    username: 'adminadmin',
    password: 'password123',
    phone: '012345678910',
    address: 'Maadi, Egypt',
    birthDate: '1997-09-09',
    postalCode: '31111',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  activeTab: string = 'edit-profile';
  editableFields: { [key: string]: boolean } = {};

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
    console.log('Settings saved:', this.user);
    // Reset all fields to read-only after saving
    this.editableFields = {};
  }
}
