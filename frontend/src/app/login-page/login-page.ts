import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { NavigationHistoryService } from '../service/navigation-history.service';

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
  successMessage: string = '';
  verificationLink: string = '';
  loading: boolean = false;
 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private navigationHistory: NavigationHistoryService,
  ) {
    this.form = this.fb.group({
      username: [''],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      phone: ['']
    });

    this.updateModeValidators();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.form.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.verificationLink = '';
    this.profileImage = null;
    this.updateModeValidators();
  }

  private updateModeValidators() {
    const username = this.form.get('username');
    const address = this.form.get('address');
    const phone = this.form.get('phone');

    if (this.isLoginMode) {
      username?.setValidators([]);
      address?.setValidators([]);
      phone?.setValidators([]);
    } else {
      username?.setValidators([Validators.required]);
      address?.setValidators([Validators.required]);
      // Accept digits only (helps both UX and compatibility with older backends that cast phone to Number)
      phone?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{7,15}$/)
      ]);
    }

    username?.updateValueAndValidity({ emitEvent: false });
    address?.updateValueAndValidity({ emitEvent: false });
    phone?.updateValueAndValidity({ emitEvent: false });
  }

  private extractErrorMessage(err: any, fallback: string): string {
    const payload = err?.error;
    if (!payload) return fallback;
    if (typeof payload === 'string') return payload;
    if (typeof payload?.message === 'string') return payload.message;
    if (typeof err?.message === 'string') return err.message;
    return fallback;
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
    this.errorMessage = '';
    this.successMessage = '';
    this.verificationLink = '';
    
    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: (res) => {
        this.authService.setUser(res.user);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || this.navigationHistory.consumeReturnUrl('/'));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.extractErrorMessage(err, 'Login failed');
        this.loading = false;
      }
    });
  }

  register() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.verificationLink = '';

    const userData = {
      name: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      address: this.form.value.address,
      phone: this.form.value.phone
    };

    this.authService.register(userData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Registration successful! Please check your email to verify your account.';
        this.isLoginMode = true;
        this.updateModeValidators();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.extractErrorMessage(err, 'Registration failed');
        this.loading = false;
      }
    });
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