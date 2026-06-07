import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DocumentResponse, TypeDocument } from '../models/document.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/documents`;

  uploader(dossierId: string, type: TypeDocument, fichier: File) {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return this.http.post<DocumentResponse>(`${this.api}/upload`, formData, {
      params: new HttpParams().set('dossierId', dossierId).set('type', type),
    });
  }

  listerParDossier(dossierId: string) {
    return this.http.get<DocumentResponse[]>(
      `${this.api}/dossier/${dossierId}`,
    );
  }

  valider(id: string, approuve: boolean, raisonRejet?: string) {
    let params = new HttpParams().set('approuve', approuve);
    if (raisonRejet) params = params.set('raisonRejet', raisonRejet);
    return this.http.post<DocumentResponse>(`${this.api}/${id}/valider`, null, {
      params,
    });
  }
}
