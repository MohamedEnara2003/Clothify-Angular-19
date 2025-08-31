import { 
    ApexAxisChartSeries,
    ApexNonAxisChartSeries,
    ApexChart, 
    ApexXAxis, 
    ApexDataLabels,
    ApexPlotOptions, 
    ApexResponsive, ApexTitleSubtitle,
    ApexStroke,
    ApexLegend, 
    ApexFill, 
    ApexTooltip, } 
from 'ng-apexcharts';


export interface ChartOptions { 
series: ApexAxisChartSeries | ApexNonAxisChartSeries; 
chart: ApexChart;
xaxis?: ApexXAxis; 
labels?: string[]; 
title?: ApexTitleSubtitle; 
dataLabels?: ApexDataLabels; 
plotOptions?: ApexPlotOptions; 
responsive?: ApexResponsive[]; 
stroke?: ApexStroke; 
legend?: ApexLegend; 
fill?: ApexFill; 
tooltip?: ApexTooltip; 
colors?: string[];
};

export interface AxisChartInput { 
series: ApexAxisChartSeries; 
categories: string[]; 
title: string; 
colors?: string[]; 
tooltip? :ApexTooltip; 
} 

export interface CircleChartInput { 
series: ApexNonAxisChartSeries; 
labels: string[]; 
title: string; 
colors?: string[]; 
plotOptions?: ApexPlotOptions;
dataLabels?: ApexDataLabels;
legend?: ApexLegend; 
}