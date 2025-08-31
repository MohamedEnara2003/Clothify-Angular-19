import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../core/services/single-ton-api.service';
import { Observable } from 'rxjs';
import { authData, User, UserData } from '../../../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private readonly singleTonApi = inject(SingleTonApi);
  
  user = signal<User | null>(null);

  register(user : authData) : Observable<{user : User , message : string}> {
  return this.singleTonApi.create('register' , user);
  }

  login(user : authData) : Observable<{user : User , message : string}> {
  return this.singleTonApi.create('login' , user);
  }


  // Check My Token in cookies
  getProfile() : Observable<{user : User , message : string}>{
  return this.singleTonApi.findData('profile');
  }

   // is Admin ONLY
  getAllUsers() : Observable<{
  data : {users : User[] ,currentPage : number , totalPages: number , total : number},
  }>{
  return this.singleTonApi.findData('users');
  }

  logOut(): Observable<void> {
  return this.singleTonApi.findData('users');
  }

  deleteUsers(ids: string[]): Observable<void> {
  return this.singleTonApi.deleteByIdWithBody('delete-user', ids);
  }
  
}
