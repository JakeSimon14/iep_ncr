import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DovsbuyService {

    constructor(private http: HttpClient) {
     }
   
     getDoVsBuyData(): Observable<any> {
       return this.http.get<any>('http://localhost:5000/api/dovsbuyData');
     }
}
