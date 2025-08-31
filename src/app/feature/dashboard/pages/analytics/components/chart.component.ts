import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions } from '../interface/charts.interface';

@Component({
  selector: 'app-dashboard-chart',
  imports: [CommonModule],
  template: `
    @defer (on viewport) {
      @if (chartComponent()) {
      <ng-container 
          *ngComponentOutlet="chartComponent(); inputs: { 
            series: chartOptions().series, 
            chart: chartOptions().chart,
            xaxis: chartOptions().xaxis, 
            title: chartOptions().title,
            fill: chartOptions().fill,
            labels: chartOptions().labels,
            dataLabels: chartOptions().dataLabels,
            legend: chartOptions().legend,
            plotOptions: chartOptions().plotOptions,
            responsive: chartOptions().responsive,
            tooltip: chartOptions().tooltip,
            colors: chartOptions().colors
          }">
        </ng-container>
      }
    } @placeholder {
      <div class="w-full h-100 bg-neutral-content animate-pulse"></div>
    }
  `,
})
export class DashboardChartComponent {
  public chartOptions = input.required<ChartOptions>();

  chartComponent = signal<any | null>(null);

  async ngOnInit() {
    // dynamic import to keep charts out of main bundle
    const { ChartComponent } = await import('ng-apexcharts');
    this.chartComponent.set(ChartComponent);
  }
}
