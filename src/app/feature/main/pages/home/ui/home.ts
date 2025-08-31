import { Component } from '@angular/core';
import { ServiceHighlightsComponent } from "../components/service-highlights.component";
import { HomeHeroSectionComponent } from "../components/home-hero-section.component";
import { ShowCollectionsComponent } from "../../../../dashboard/pages/collections/components/show-collections.component";


@Component({
  selector: 'app-home',
  imports: [
  ServiceHighlightsComponent,
  HomeHeroSectionComponent,
  ShowCollectionsComponent],
  template: `
  <section aria-label="Home Page" role="region" class="w-full grid grid-cols-1 gap-15">
  <app-home-hero-section/>
  <app-show-collections />
  <app-service-highlights />
  </section>
  `,
})
export class Home {
  
}
