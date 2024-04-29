import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }

  getAddress(cep: any): Observable<any> {
    const url = "https://viacep.com.br/"
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get(url + `ws/${cep}/json/`, { headers });
  }
}
