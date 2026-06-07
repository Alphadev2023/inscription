import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  CreerDossierRequest,
  DossierResponse,
  DossierSummaryResponse,
  StatutDossier,
} from '../models/dossier.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DossierService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/dossiers`;

  creer(request: CreerDossierRequest) {
    return this.http.post<DossierResponse>(this.api, request);
  }

  monDossier() {
    return this.http.get<DossierResponse>(`${this.api}/mon-dossier`);
  }

  soumettre(id: string) {
    return this.http.post<DossierResponse>(`${this.api}/${id}/soumettre`, {});
  }

  mettreAJourScore(id: string, score: number) {
    return this.http.put<DossierResponse>(`${this.api}/${id}/score`, null, {
      params: new HttpParams().set('score', score),
    });
  }

  lister(statut?: StatutDossier) {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    return this.http.get<DossierSummaryResponse[]>(this.api, { params });
  }

  trouverParId(id: string) {
    return this.http.get<DossierResponse>(`${this.api}/${id}`);
  }

  valider(id: string) {
    return this.http.post<DossierResponse>(`${this.api}/${id}/valider`, {});
  }

  rejeter(id: string, raison: string) {
    return this.http.post<DossierResponse>(`${this.api}/${id}/rejeter`, null, {
      params: new HttpParams().set('raison', raison),
    });
  }
}
