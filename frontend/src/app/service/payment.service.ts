import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://odogwubites.onrender.com/payment';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  deposit(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deposit`, { amount }, { headers: this.getHeaders() });
  }

  getBalance(): Observable<any> {
    return this.http.get(`https://odogwubites.onrender.com/auth/profile`, { headers: this.getHeaders() });
  }

  getAllPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-payments`, { headers: this.getHeaders() });
  }

  getUserPayments(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-payments/${userId}`, { headers: this.getHeaders() });
  }

  confirmPayment(paymentId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/confirm/${paymentId}`, {}, { headers: this.getHeaders() });
  }
}
