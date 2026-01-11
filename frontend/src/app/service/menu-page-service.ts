import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuPageService {
  private apiUrl = 'https://odogwubites.onrender.com/menu';

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getMenuItemById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  searchMenuItems(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  createMenuItem(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/create`, formData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  updateMenuItem(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/update/${id}`, formData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  deleteMenuItem(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}
