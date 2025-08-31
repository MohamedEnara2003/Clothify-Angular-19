import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { TranslationService } from '../../../../../core/services/translations/translation.service';
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-home-hero-section',
  imports: [SharedModule, NgImageComponent],
  template: `

  <section 
  class="grid grid-cols-1 md:grid-cols-2 gap-10 px-5 md:px-10 py-10  min-h-svh  items-start"
  role="region"
  aria-labelledby="hero-heading">

<header class="space-y-5 w-full max-w-xl mx-auto lg:mx-0">
<p class="text-neutral/50 uppercase tracking-wider text-sm sm:text-base" aria-hidden="true">
  {{ 'hero.newArrival' | translate }} • {{ translate.heroTexts('hero.summerCollection') }}
</p>

<h1 id="hero-heading" class="text-4xl md:text-5xl font-extrabold text-neutral leading-tight">
  {{ translate.heroTexts('hero.upgradeStyle') }}
  <span class="text-neutral">{{ translate.heroTexts('hero.fashionForward') }}</span>
</h1>

<p class="text-neutral/70 text-base sm:text-lg leading-relaxed">
  {{ translate.heroTexts('hero.discoverRange') }}
</p>

<ul class="text-neutral/70 text-sm sm:text-base list-disc list-inside">
  <li>{{translate.heroTexts('hero.premiumQuality') }}</li>
  <li>{{translate.heroTexts('hero.modernFit') }}</li>
  <li>{{translate.heroTexts('hero.multipleColors') }}</li>
</ul>


<nav role="navigation" class="pt-4 flex justify-center lg:justify-start items-center gap-2">
<button
  routerLink="/main/collections"
  class="btn btn-neutral rounded-2xl"
  [attr.aria-label]="translate.heroTexts('hero.exploreCollection')"
>
  {{ translate.heroTexts('hero.shopNow') }}
  <span class="material-icons">call_made</span>
</button>

<button
  routerLink="/main/collections"
  [queryParams]="{tags : 'Popular'}"
  class="btn btn-outline rounded-2xl"
  [attr.aria-label]="translate.heroTexts('hero.exploreCollection')"
>
  {{ translate.heroTexts('hero.TrendyCollections') }}
  <span class="material-icons">call_made</span>
</button>
</nav>

</header>

<figure 
  class="w-full flex justify-center items-center h-full max-h-[900px]" 
  role="img" 
  [attr.aria-label]="translate.heroTexts('hero.fashionModels')"
>
  
    <app-ng-image
        [options]="{
        src : heroImage,
        alt : translate.heroTexts('hero.stylishClothes'),
        placeholder  : heroPlaceholderImage ,
        width :  700 , 
        height : 700 ,
        class : 'w-full max-w-[700px] h-auto object-contain' ,
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority  : 'high',
        srcset : heroImageSrcSet,
        sizes : heroImageSizes
        }"
        [title]="translate.heroTexts('hero.exploreSummer')"
        />
  <figcaption class="sr-only">
    {{ translate.heroTexts('hero.modelsCaption') }}
  </figcaption>
</figure>
</section>

  `,
})
export class HomeHeroSectionComponent {
  public translate = inject(TranslationService);

  heroImage: string = "https://res.cloudinary.com/dphfyg0f8/image/upload/v1754707848/banner-home_guhrur.webp";
  heroPlaceholderImage: string = "/hero-image-2.webp";

  heroImageSrcSet: string = `
  https://res.cloudinary.com/dphfyg0f8/image/upload/w_400,f_auto,q_auto/v1754707848/banner-home_guhrur.webp 400w,
  https://res.cloudinary.com/dphfyg0f8/image/upload/w_700,f_auto,q_auto/v1754707848/banner-home_guhrur.webp 700w,
  https://res.cloudinary.com/dphfyg0f8/image/upload/w_1200,f_auto,q_auto/v1754707848/banner-home_guhrur.webp 1200w
  `;

  heroImageSizes: string = "(max-width: 768px) 100vw, 700px";
}
