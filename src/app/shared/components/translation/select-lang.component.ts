import { Component, inject, linkedSignal } from '@angular/core';

import { LocaleStorageService } from '../../../core/services/locale-storage.service';
import { LanguageService, SupportedLanguages } from '../../../core/services/translations/language.service';

@Component({
  selector: 'app-select-lang',
  imports: [],
  template: `
  <label class="select select-sm text-base">
    <label for="select-language" class="label">
    <img 
    [src]="currentLang() === 'en' ? 'en.webp' : 'ar.webp'" 
    [alt]="currentLang() === 'en' ? 'English' : 'Arabic'"
    width="35" height="35" class="object-cover">
    </label>

  <select name="select-language" id="select-language" 
    (change)="selectLanguage($event)">
    <option value="en" [selected]="currentLang() === 'en'">English</option>
    <option value="ar" [selected]="currentLang() === 'ar'">Arabic</option>
    </select>
  </label>  
  `
})
export class SelectLangComponent {
  private readonly languageService = inject(LanguageService);
  private readonly localeStorageService = inject(LocaleStorageService);
  
  currentLang = linkedSignal(() =>  {
  const langKey = this.languageService.languageKey ;
  const lang : string = this.localeStorageService.getItem(langKey)!;
  return lang
  })

  
  selectLanguage(e : Event) : void {
  const lang = (e.target as HTMLSelectElement).value;
  this.languageService.onChangeLanguage(lang as SupportedLanguages);
  this.currentLang.set(lang);
  }

}
