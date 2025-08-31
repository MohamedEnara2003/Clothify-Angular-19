import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../../shared/modules/shared.module';
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { ResponsiveNavLinks } from "./shared/components/navigations/responsive-nav-links/responsive-nav-links";


@Component({
  selector: 'app-main',
  imports: [RouterOutlet, SharedModule, Header, Footer, ResponsiveNavLinks],
  template: `
  <section  class="w-full" aria-label="Main Page" role="section">
  <app-header />
  <main aria-label="Main Routes" role="main" class="w-full p-6 px-2 sm:px-4 md:px-8">
  <router-outlet />
  <app-responsive-nav-links  />
  </main>
  <app-footer />

  </section>
  `,
})
export class Main {

  
}
