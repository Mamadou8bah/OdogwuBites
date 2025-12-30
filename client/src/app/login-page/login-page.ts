import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  isLoginMode = true;
  profileImage: string | ArrayBuffer | null = null;
  form: FormGroup;

  errorMessage: string = '';
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
   
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [''],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.form.reset();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.profileImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoginMode ? this.login() : this.register();
  }

  login() {
    this.loading = true;
   
  }

  register() {
    this.loading = true;
    const formData = new FormData();
    formData.append('fullname', this.form.value.username);
    formData.append('password', this.form.value.password);
    formData.append('email', this.form.value.email);

    if (this.profileImage && typeof this.profileImage === 'string') {
      const blob = this.dataURLtoBlob(this.profileImage);
      formData.append('avatar', blob, 'profile.png'); 
    }

  
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}