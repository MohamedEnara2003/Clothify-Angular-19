import { Component, input } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';

@Component({
  selector: 'app-pagination',
  imports: [SharedModule],
  template: `
  @if(currentPage() &&  totalPages()){ 
      <nav aria-label="Pagination" role="navigation" 
      class="join grid grid-cols-2">
      <button role="button" aria-label="Button Previous"
      class="join-item btn btn-neutral"  [disabled]="currentPage() === 1"
      [routerLink]="[]" [queryParams]="{page : this.currentPage()  -  1}" queryParamsHandling="merge"
      >
      Previous page
      </button>
      <button role="button" aria-label="Button Next"
      class="join-item btn btn-neutral"  [disabled]="currentPage() === totalPages()"
      [routerLink]="[]" [queryParams]="{page : this.currentPage() +  1}" queryParamsHandling="merge"> 
      Next
      </button>
      </nav>
  }
  `,
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
}
