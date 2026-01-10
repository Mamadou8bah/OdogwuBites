import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserListItemDto = {
  _id: string;
  name: string;
  email: string;
  phone: number | string;
  address: string;
  role: 'customer' | 'admin' | 'staff';
  verified: boolean;
  balance: number;
  createdAt: string;
  totalPayments: number;
  orderCount: number;
};

export type UsersListResponseDto = {
  users: UserListItemDto[];
};

export type UserDetailsResponseDto = {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: number | string;
    address: string;
    role: 'customer' | 'admin' | 'staff';
    verified: boolean;
    balance: number;
    createdAt: string;
  };
  metrics: {
    totalPayments: number;
    orderCount: number;
  };
  recentOrders: Array<{
    _id: string;
    total: number;
    status: string;
    createdAt: string;
    item: string;
  }>;
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUsers(): Observable<UsersListResponseDto> {
    return this.http.get<UsersListResponseDto>(this.apiUrl, { headers: this.getHeaders() });
  }

  getUserById(userId: string): Observable<UserDetailsResponseDto> {
    return this.http.get<UserDetailsResponseDto>(`${this.apiUrl}/${userId}`, {
      headers: this.getHeaders()
    });
  }
}
