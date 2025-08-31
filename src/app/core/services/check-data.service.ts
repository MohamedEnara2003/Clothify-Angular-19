import { computed, Injectable, linkedSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CheckDataService {
  allDataIds = linkedSignal<string[]>(() => []);
  private lastIds: string[] = [];

  valueIds = signal<string[]>([]);

  isCheckAllData = computed<boolean>(() =>  {
  const  valueIds = this.valueIds();
  return valueIds.length > 0 ? valueIds.length === this.allDataIds().length : false
  });
  
  initAllDataIds (allDataIds : string[]) : void {
  this.allDataIds.set(allDataIds);
  if (allDataIds.length !== this.lastIds.length || allDataIds.some((id, i) => id !== this.lastIds[i])) {
  this.lastIds = allDataIds;
  }
  }

  onCheckData(id : string) : void {
  const existingproductId = this.valueIds().includes(id);
  this.valueIds.update((prevIds) => 
    existingproductId ? prevIds.filter((prevId) => prevId !== id ) : [...prevIds , id]);
  }
  onCheckAllData() : void {
  if(this.allDataIds().length > 0){
  this.valueIds.set(this.isCheckAllData() ? [] : this.allDataIds())
  }
  }


  clearAllChecks () : void {
  this.allDataIds.set([]);
  this.valueIds.set([]);
  }
}
