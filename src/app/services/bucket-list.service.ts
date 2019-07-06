import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Response } from '../response';
import {BucketModel} from '../home/bucket';

const ROUTE = 'bucketlists';

@Injectable({
  providedIn: 'root'
})
export class BucketListService {
  bucket: BucketModel;
  constructor(
    private http: HttpClient
  ) { }

  create(payload) {
    return this.http.post<Response>(`${environment.apiUrl}${ROUTE}`, payload);
  }
  getAll(page: number = 1, limit: number = 20, bucketName: string = '') {
    if (bucketName) {
      return this.http.get<Response>(`${environment.apiUrl}${ROUTE}?q=${bucketName}`);
    } else {
      return this.http.get<Response>(`${environment.apiUrl}${ROUTE}?page=${page}&limit=${limit}`);
    }
  }
  get(bucketId) {
    return this.http.get<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}`);
  }
  update(payload, bucketId) {
    return this.http.put<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}`, payload);
  }
  delete(bucketId) {
    return this.http.delete<Response>(`${environment.apiUrl}${ROUTE}/${bucketId}`);
  }
}
