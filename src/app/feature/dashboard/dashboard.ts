import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardHeader } from "./shared/components/dashboard-header/dashboard-header";
import { DashboardAside } from "./shared/components/dashboard-aside/dashboard-aside";
import { SharedModule } from '../../shared/modules/shared.module';
import { UploadFiles } from '../../core/services/upload-files.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, DashboardHeader, DashboardAside, SharedModule],
  template: `
  <section class="w-full h-svh flex justify-between bg-white" aria-label="Dashboard Page">

  <app-dashboard-aside
  [isLoad]="isLoadAside()"
  (isLoadChange)="isLoadAside.set($event)"
  class="h-full duration-200 transition-all"
  [ngClass]="isLoadAside() ? 'w-15'  : 'w-80'" />

<main aria-label="Dashboard Routes" class=" size-full grid grid-cols-1 gap-6 px-4 py-2">
  <app-dashboard-header class="w-full h-[10%] "/>
  <div class="w-full h-[90svh]">
  <router-outlet />
  </div>
  </main>

  </section>
  `,
  providers : [UploadFiles]
})
export class Dashboard implements OnInit{
    private readonly uploadFilesService = inject(UploadFiles);
    isLoadAside = signal<boolean>(false);


  ngOnInit(): void {
  this.autoDeleteTempImages();
  }

  private autoDeleteTempImages() : void {
  this.uploadFilesService.autoDeleteTempImages().pipe(take(1)).subscribe();
  }
  
}
