import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AuthService } from '../../../core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface AgentResponse {
  id: string;
  email: string;
  role: string;
  actif: boolean;
  creeLe: string;
}

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './agents.component.html',
})
export class AgentsComponent implements OnInit {
  private http = inject(HttpClient);

  agents = signal<AgentResponse[]>([]);
  loading = signal(true);
  erreur = signal('');

  ngOnInit() {
    this.chargerAgents();
  }

  chargerAgents() {
    this.loading.set(true);
    this.http
      .get<AgentResponse[]>(`${environment.apiUrl}/admin/utilisateurs`)
      .subscribe({
        next: (data) => {
          this.agents.set(data.filter((u) => u.role === 'AGENT'));
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.erreur.set('Erreur de chargement');
        },
      });
  }

  getInitiales(email: string): string {
    return email.substring(0, 2).toUpperCase();
  }
}
