import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  private apiUrl = 'http://localhost:3000/menu';
 
  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getFavoriteItems(): Observable<any[]> {
    return this.getMenuItems().pipe(
      map(items => items.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4))
    );
  }
}
