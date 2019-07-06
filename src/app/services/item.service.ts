import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Response } from '../response';
const ROUTE = 'bucketlists';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http: HttpClient
  ) { }

  create(payload, bucketId) {
    return this.http.post<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}/items`, payload);
  }
  getAll(bucketId) {
    return this.http.get<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}/items`);
  }
  get(bucketId, itemId) {
    return this.http.get<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}/items/${itemId}`);
  }
  update(payload, bucketId, itemId) {
    return this.http.put<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}/items/${itemId}`, payload);
  }
  delete(bucketId, itemId) {
    return this.http.delete<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}/items/${itemId}`);
  }
}
