import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/notifications`;

  trouverMesNotifications(utilisateurId: string) {
    return this.http.get<any[]>(`${this.api}/utilisateur/${utilisateurId}`);
  }
}
