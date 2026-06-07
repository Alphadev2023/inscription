import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<User | null>(this.getUserFromStorage());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly role = computed(() => this._user()?.role ?? null);
  readonly isAdmin = computed(() => this.role() === 'ADMIN');
  readonly isAgent = computed(() => this.role() === 'AGENT');
  readonly isCandidat = computed(() => this.role() === 'CANDIDAT');

  login(request: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((res) => this.saveSession(res)));
  }

  register(request: RegisterRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap((res) => this.saveSession(res)));
  }

  logout() {
    localStorage.clear();
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(response: AuthResponse) {
    const payload = this.parseJwt(response.accessToken);
    const user: User = {
      id: payload.sub,
      email: payload.email ?? payload.sub,
      role: response.role as User['role'],
    };
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this._token.set(response.accessToken);
    this._user.set(user);

    // Fix InvalidStateError
    setTimeout(() => {
      if (user.role === 'CANDIDAT') {
        this.router.navigateByUrl('/candidat/dashboard');
      } else {
        this.router.navigateByUrl('/admin/dashboard');
      }
    }, 100);
  }

  private parseJwt(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }

  private getUserFromStorage(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}
