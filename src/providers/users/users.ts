import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { SERVER_NAME } from '../config';

@Injectable()
export class UsersProvider {
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
  signin(user) {
    let repos = this.http.post(`${SERVER_NAME}/api/auth/sign_in`, user, this.options);
    return repos;
  }

  volunteers() {
    this.setHeaders();
    let repos = this.http.get(`${SERVER_NAME}/api/users/volunteers`, this.options);
    return repos;
  }
  myteam() {
    this.setHeaders();
    let repos = this.http.get(`${SERVER_NAME}/api/users/myteam`, this.options);
    return repos;
  }
  map() {
    this.setHeaders();
    let repos = this.http.get(`${SERVER_NAME}/api/users/map`, this.options);
    return repos;
  }
  signout() {
    this.setHeaders();
    let repos = this.http.delete(`${SERVER_NAME}/api/auth/sign_out`, this.options);
    return repos;
  }
  updatePosition(position) {
    this.setHeaders();
    let repos = this.http.post(`${SERVER_NAME}/api/users/updatePosition`, position, this.options);
    return repos;
  }

}
