import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private titleService: Title, private metaService: Meta) {}

  updateMetaData(options: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string;
  }) {
    
    // Title
    this.titleService.setTitle(options.title);

    // Meta Tags
    this.metaService.updateTag({ name: 'description', content: options.description || '' });
    this.metaService.updateTag({ name: 'keywords', content: options.keywords || '' });

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: options.title });
    this.metaService.updateTag({ property: 'og:description', content: options.description || '' });
    this.metaService.updateTag({ property: 'og:image', content: options.image || '' });
    this.metaService.updateTag({ property: 'og:url', content: options.url || window.location.href });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Cards
    this.metaService.updateTag({ name: 'twitter:title', content: options.title });
    this.metaService.updateTag({ name: 'twitter:description', content: options.description || '' });
    this.metaService.updateTag({ name: 'twitter:image', content: options.image || '' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
}
