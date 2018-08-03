import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { SERVER_NAME } from '../config';

@Injectable()
export class VolunteersProvider {
  private options;
  constructor(private http: Http) {  
    let headers = new Headers({
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      'client': localStorage.getItem('client'),
      'uid': localStorage.getItem('uid'),
      'access-token': localStorage.getItem('access-token')
    });
    this.options = new RequestOptions({ headers: headers, withCredentials: true });
  }
  setHeaders() {
    let headers = new Headers({
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      'client': localStorage.getItem('client'),
      'uid': localStorage.getItem('uid'),
      'access-token': localStorage.getItem('access-token')
    });
    this.options = new RequestOptions({ headers: headers, withCredentials: true });
  }
  create(volunteers) {
    let repos = this.http.post(`${SERVER_NAME}/api/volunteers`, volunteers, this.options);
    return repos;
  }

}
