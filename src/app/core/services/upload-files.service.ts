import { inject, Injectable } from '@angular/core';
import { SingleTonApi } from './single-ton-api.service';
import { Observable } from 'rxjs';
import { UploadImage } from '../interfaces/files.interface';


@Injectable()

export class UploadFiles {

  private readonly singleTonApi = inject(SingleTonApi);

  uploadFiles(files : File[]) : Observable<{data : UploadImage[] , message : string}> {
  return this.singleTonApi.uploadImage('upload', files)
  }

  removeFiles(imageId : string) : Observable<void> {
  return this.singleTonApi.deleteImage('delete-image', imageId)
  }

  autoDeleteTempImages() : Observable<void> {
  return this.singleTonApi.deleteByIdWithBody('delete-temp-images');
  }

}
