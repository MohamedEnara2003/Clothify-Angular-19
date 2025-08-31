import { Injectable, signal } from '@angular/core';

interface ConfirmOption {
  message : string ,
  icon : string ,
  accept : () =>  void ,
  reject : () =>  void ,
}


@Injectable({
  providedIn: 'root'
})


export class ConfirmPopupService {

  confirmOption = signal<ConfirmOption | null>(null);

  confirm(confirmData : ConfirmOption | null) : void {
  this.confirmOption.set(confirmData);
  }

  confirmStatus(status : boolean) : void {
    const confirmOption = this.confirmOption()
    if(confirmOption){
    status ?   confirmOption.accept() :  confirmOption?.reject();
    }
    this.closeConfirm();
  }

  private closeConfirm() : void {
  this.confirmOption.set(null);
  }
}
