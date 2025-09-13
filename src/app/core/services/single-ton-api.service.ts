import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SingleTonApi {
  private readonly httpClient = inject(HttpClient);  
  private readonly BaseUrlApi : string = 'https://clothify-express-server.vercel.app/';


  findData<G>(endpoint : string ) : Observable<G> {
  return this.httpClient.get<G>(`${this.BaseUrlApi}${endpoint}` , {
  withCredentials : true
  });
  }

  findDataById<G>(endpoint : string , id : string | number) : Observable<G> {
  return this.httpClient.get<G>(`${this.BaseUrlApi}${endpoint}/${id}` , {
  withCredentials : true,
  });
  }

  create<G>(endpoint : string , data? : unknown) : Observable<G> {
  return this.httpClient.post<G>(`${this.BaseUrlApi}${endpoint}`, data , {
  withCredentials : true
  }).pipe(
  take(1),
  );
  }
  
  updateById<G>(endpoint : string , data : unknown , id : string | number) : Observable<G> {
  return this.httpClient.put<G>(`${this.BaseUrlApi}${endpoint}/${id}`, data ,{
    withCredentials : true
  });
  }
    

  uploadImage<G>(endpoint : string , files : File[]) : Observable<G> {
  const formData = new FormData();
  files.forEach((file) => {
  formData.append('image' , file);
  });
  return this.httpClient.post<G>(`${this.BaseUrlApi}${endpoint}`, formData  , {
  withCredentials : true,
  });
  }

  deleteImage(endpoint : string , id : string) : Observable<void> {
  return this.httpClient.delete<void>(`${this.BaseUrlApi}${endpoint}` , {
    withCredentials : true,
    body : {id}
  });
  }

  deleteById<G>(endpoint : string , id : string |  number) : Observable<G> {
    return this.httpClient.delete<G>(`${this.BaseUrlApi}${endpoint}/${id}` , {
      withCredentials : true
    });
    }

    deleteByIdWithBody<G>(endpoint : string , data? : unknown) : Observable<G> {
    return this.httpClient.delete<G>(`${this.BaseUrlApi}${endpoint}` , {
      withCredentials : true,
      body : data
    });
    }
    
}
