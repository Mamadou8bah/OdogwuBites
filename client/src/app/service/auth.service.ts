import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = {
    id: 'user_123', // Hardcoded for now
    name: 'Admin',
    email: 'Admin@gmail.com'
  };

  get currentUser() {
    return this._user;
  }
}
