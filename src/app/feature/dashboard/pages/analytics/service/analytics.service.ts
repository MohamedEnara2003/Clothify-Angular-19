import { inject, Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { AxisChartInput, ChartOptions, CircleChartInput } from "../interface/charts.interface";




@Injectable()
export class AnalyticsService {
    private translateService = inject(TranslateService)

  generateAxisChart(type: 'line' | 'bar' | 'area' | 'radar' , input: AxisChartInput): ChartOptions {
  return {
    series: [{ 
    name: this.translateText(input.series[0].name || '') , 
    data: input.series[0].data } 
    ],
    chart: { type, height: 300 , zoom: { enabled: false } }, 
    xaxis: { categories: input.categories.map((cate) => cate ? this.translateText(cate) : '') },
    colors: input.colors ?? ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'], 
    tooltip : input.tooltip || {}, 
    title: { text: this.translateText(input.title)}, 
    ...(type === 'area' && { fill: { type: 'gradient' }, stroke: { curve: 'smooth' } }) }; 
  }


generateCircleChart(
  type: 'pie' | 'donut' | 'radialBar' | 'polarArea',
  input: CircleChartInput
): ChartOptions {
  const base: ChartOptions = {
    series: input.series,
    chart: {
      type,
      height: 300,
      zoom: { enabled: false }
    },
    labels: input.labels.map((l) => (l ? this.translateText(l) : '')),
    colors: input.colors ?? ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    title: { text: this.translateService.instant(input.title) },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        return `${label}: ${val.toFixed(1)}%`;
      }
    },
    legend: input.legend ?? { show: true, position: 'bottom' }
  };

  if (type === 'radialBar') {
    base.plotOptions = input.plotOptions ?? {
      radialBar: {
        dataLabels: {
          name: { fontSize: '22px' },
          value: { fontSize: '16px' }
        }
      }
    };
  }

  return base;
}

  translateText(value : string) : string {
  return this.translateService.instant(value) ;
  }
}