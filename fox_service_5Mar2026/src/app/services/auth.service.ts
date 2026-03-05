import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User { mobile: string; token: string; name?: string }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // load from storage if available
    try {
      const raw = localStorage.getItem('app_user_v1');
      if (raw) this.userSubject.next(JSON.parse(raw));
    } catch {}
  }

  login(mobile: string) {
    // lightweight stubbed login for migration — replace with real API later
    const user: User = { mobile, token: 'dev-token', name: '' };
    this.userSubject.next(user);
    try { localStorage.setItem('app_user_v1', JSON.stringify(user)); } catch {}
    return user;
  }

  logout() {
    this.userSubject.next(null);
    try { localStorage.removeItem('app_user_v1'); } catch {}
  }

  get current() { return this.userSubject.value; }
}
