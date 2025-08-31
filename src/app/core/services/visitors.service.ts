import { inject, Injectable } from '@angular/core';
import { SingleTonApi } from './single-ton-api.service';
import {  Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VisitorsService {
  private readonly EndPoint : string = "visitors"
  private readonly singleTonApi = inject(SingleTonApi);


  createVisitors() : Observable<void> {
  return this.singleTonApi.create(this.EndPoint)
  }
  
  getTotalVisitors() : Observable<{data : number , message : string}> {
  return this.singleTonApi.findData(this.EndPoint)
  }
}
