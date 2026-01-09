import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, orderData, { headers: this.getHeaders() });
  }

  getOrdersByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel/${orderId}`, {}, { headers: this.getHeaders() });
  }

  deliverOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deliver/${orderId}`, {}, { headers: this.getHeaders() });
  }

  acceptOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept/${orderId}`, {}, { headers: this.getHeaders() });
  }
}
