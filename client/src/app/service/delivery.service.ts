import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:3000/delivery-staff';

  constructor(private http: HttpClient) {}

  getAllDeliveryStaff(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createDeliveryStaff(email: string): Observable<any> {
    return this.http.post(this.apiUrl, { email });
  }

  deleteDeliveryStaff(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDeliveryStaffById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateDeliveryStaff(id: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updateData);
  }
}
