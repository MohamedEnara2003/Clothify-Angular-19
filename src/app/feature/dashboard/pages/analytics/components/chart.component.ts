import { Component, input  } from '@angular/core';
import { NgApexchartsModule} from 'ng-apexcharts'; 


@Component({
  selector: 'app-dashboard-chart',
  imports: [NgApexchartsModule],
  template: `
  @defer (on viewport) {
  @if(chartOptions()){
  <apx-chart 
  [series]="chartOptions().series || []" 
  [chart]="chartOptions().chart || {}"
  [xaxis]="chartOptions().xaxis || {}" 
  [title]="chartOptions().title!" 
  [fill]="chartOptions().fill!" 
  [labels]="chartOptions().labels || []"
  [dataLabels]="chartOptions().dataLabels!" 
  [legend]="chartOptions().legend!" 
  [plotOptions]="chartOptions().plotOptions!" 
  [responsive]="chartOptions().responsive!" 
  [tooltip]="chartOptions().tooltip || {}" 
  [colors]="chartOptions().colors || []" /> 
}
  }@placeholder {
  <div class="w-full h-100 bg-neutral-content animate-pulse"></div>
  }
  `,
})
export class DashboardChartComponent {
public chartOptions = input<any>();
}
