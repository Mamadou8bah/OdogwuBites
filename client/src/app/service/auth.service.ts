import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: any = null;
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this._user = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
  }

  get isLoggedIn(): boolean {
    return !!this._user;
  }

  get currentUser() {
    if (!this._user) return null;
    return {
        _id: this._user._id || this._user.id,
        name: this._user.name,
        email: this._user.email,
        role: this._user.role,
        balance: this._user.balance
    };
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  setUser(user: any) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this._user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  updateProfile(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/profile`, userData, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      tap((res: any) => {
        if (res.user) this.setUser(res.user);
      })
    );
  }
}
