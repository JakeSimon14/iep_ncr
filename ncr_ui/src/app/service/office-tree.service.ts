import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class OfficeTreeService {

  constructor(private http: HttpClient) {
  }

  getOfficesTree(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/officestreedata');
  }
}
