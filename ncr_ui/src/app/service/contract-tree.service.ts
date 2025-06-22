import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractTreeService {

  constructor(private http: HttpClient) {
  }

  getContractTree(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/contracts');
  }
}
