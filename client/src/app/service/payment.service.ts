import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/payment/checkout';

  constructor(private http: HttpClient) {}

  checkout(userId: string, paymentMethod: 'Online' | 'Cash'): Observable<any> {
    return this.http.post(this.apiUrl, { userId, paymentMethod });
  }
}
