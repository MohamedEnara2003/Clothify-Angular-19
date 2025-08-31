import { Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../../../../../store/auth/auth.signal';
import { ProductsStore } from '../../../../../store/products/products.signals';
import { OrderStore } from '../../../../../store/orders/orders.signal';
import { AnalyticsService } from '../service/analytics.service';
import { VisitorsService } from '../../../../../core/services/visitors.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnalyticsHeaderComponent } from "../components/analytics-header.component";
import { OrderStatus } from '../../../../../core/interfaces/order.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { CurrencyPipe } from '@angular/common';
import { Gender, ProductCategory } from '../../../../../core/interfaces/products.interface';


import { DashboardChartComponent } from "../components/chart.component";
import { Role } from '../../../../../core/interfaces/user.interface';
import { ChartOptions } from '../interface/charts.interface';

@Component({
  selector: 'app-analytics',
  imports: [
    SharedModule,
    AnalyticsHeaderComponent,
    DashboardChartComponent
],
  template: `
  <section aria-label="Analytics Page" role="region" class="size-full  grid grid-cols-1 gap-2">
  
  <app-analytics-header [dashboardCards]="dashboardCards()"/>


<main aria-label="Main Analytics" role="main" class="size-full overflow-y-auto py-4 grid grid-cols-1 gap-5"> 
  @for (analytic of allAnalytics(); track analytic.title) {
    <article [attr.aria-label]="'Article ' + analytic.title" role="article" 
    class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <h1 class="card-title text-xl lg:col-span-3 font-extrabold text-neutral"> 
    {{'dashboard.' + analytic.title | translate}}
    </h1>
    @for (chart of analytic.charts; let i = $index ; track chart.id) { 
    <app-dashboard-chart [chartOptions]="chart.data" 
    class="bg-neutral-content p-1 rounded" 
    [ngClass]="(i + 1) % 2 ? 'lg:col-span-2' : 'lg:col-span-1'" /> 
    } 
    </article> 
    } 
</main>

  </section>
  `,
  providers : [AnalyticsService , CurrencyPipe]  
})
export class AnalyticsComponent {
  private readonly analyticsService = inject(AnalyticsService)
  private readonly authStore = inject(AuthStore);
  private readonly productsStore = inject(ProductsStore );
  private readonly orderStore = inject(OrderStore);
  private readonly visitorsService = inject(VisitorsService);
  private readonly currencyPipe = inject(CurrencyPipe);
  
  visitors = signal<number>(0);

  ordersAnalytics = computed(() => {
  const statusCounts : Record<OrderStatus, number> = {
    Pending: 0,
    Accepted: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  this.orderStore.orders().forEach(({ orders }) => {
    orders.forEach(order => {
      const status = order.orderStatus as OrderStatus
      if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
      }
    });
  });

  return statusCounts;
});


  private Month : string[] = 
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  dashboardCards = computed<Array<{title : string , icon : string , count : number}>>( () => [
  {title : 'dashboard.Total Visitors' , icon : 'visibility', count :  this.visitors()},
  {title : 'dashboard.Total Users' , icon : 'people', count : this.authStore.totalUsers()},
  {title : 'dashboard.Total Products' , icon : 'inventory', count : this.productsStore.totalProducts()},
  {title : 'dashboard.Total Orders' , icon : 'shopping_basket', count : this.orderStore.totalOrders()},
  ])


  // All Analytics
  allAnalytics = computed<Array<{charts : Array<{id : number , data : ChartOptions}>  , title : string }>>(() => [
  {
  title : 'Orders Analytics' ,
  charts : [
  {id : 1 , data : this.salesOverView()},
  {id : 2 , data : this.ordersStatus()},
  ],
  },
  {
  title : 'Products Analytics' ,
  charts : [
  {id : 1 , data : this.categories()!},
  {id : 2 , data : this.productsCountAboutGender()},
  ]
  },
  {
  title : 'Users Analytics' ,
  charts : [
  {id : 1 , data : this.usersGrowth()},
  {id : 2 , data : this.userRoles()},
  ],
  }
  ])


  constructor(){
  this.getTotalVisitors();
  this.productsStore.getProducts(1 , undefined , undefined , 'gender,category');  
  this.authStore.getAllUsers();
  this.orderStore.getAllUserOrders();
  }

  // 1️⃣ Sales Overview
  private salesOverView(): ChartOptions {
    const salesOrders = this.orderStore.orders()
      .flatMap(({ orders }) => orders)
      .filter(order =>
        order.orderStatus === 'Delivered' ||
        order.orderStatus === 'Shipped'
      );

    const monthlySales: number[] = new Array(12).fill(0);
    salesOrders.forEach(order => {
      if (!order.createdAt) return;
      const monthIndex = new Date(order.createdAt).getMonth();
      monthlySales[monthIndex] += order.totalPrice || 0;
    });

    return this.analyticsService.generateAxisChart('area', {
      series: [{ name: 'dashboard.Sales', data: monthlySales }],
      categories: this.Month,
      title: 'dashboard.Sales Overview',
      colors: ['#2196F3'],
      tooltip: {
        y: {
          formatter: (val: number): string => this.formatPrice(val || 0)
        }
      }
    });
  }

  // 2️⃣ Orders Status
  private ordersStatus(): ChartOptions {
    return this.analyticsService.generateCircleChart('pie', {
      series: Object.values(this.ordersAnalytics()),
      labels: Object.keys(this.ordersAnalytics()).map(
        (s) => `dashboard.${s}`
      ),
      title: 'dashboard.Orders',
      colors: [
        'var(--color-info)',
        'var(--color-success)',
        'var(--color-warning)',
        'var(--color-secondary)',
        'var(--color-error)'
      ]
    });
  }

  // 3️⃣ Products Analytics - Gender Count
  private productsCountAboutGender(): ChartOptions {
    const genders = this.productsStore.genders() as Gender[];
    const getCount = (value: Gender): number =>
      this.productsStore.products().filter(({ gender }) => gender === value).length;

    return this.analyticsService.generateCircleChart('donut', {
      series: genders.map((g) => getCount(g)),
      labels: genders.map((g) => `gender.${g}`),
      title: 'dashboard.Genders'
    });
  }

  // 4️⃣ Products Analytics - Categories
  private categories(): ChartOptions | null {
    const products = this.productsStore.products();
    const categories = this.productsStore.categories();

    if (!products.length || !categories.length) return null;

    const getCount = (value: ProductCategory): number =>
      products.filter(({ category }) => category === value).length;

    return this.analyticsService.generateAxisChart('bar', {
      series: [{
        name: 'dashboard.Count',
        data: categories.map((c) => getCount(c as ProductCategory))
      }],
      categories: categories.map((c) => `category.${c}`),
      title: 'dashboard.Products Categories'
    });
  }

  // 5️⃣ Users Analytics - Roles
  private userRoles(): ChartOptions {
    const roles = this.authStore.roles();
    const getCount = (value: Role): number =>
      this.authStore.users().filter(({ role }) => role === value).length;

    return this.analyticsService.generateCircleChart('polarArea', {
      series: roles.map((r) => getCount(r)),
      labels: roles.map((r) => `role.${r}`),
      title: 'dashboard.Users Roles'
    });
  }

  // 6️⃣ Users Analytics - Growth
  private usersGrowth(): ChartOptions {
    const usersGrowth = this.authStore.users();
    const monthlySales: number[] = new Array(12).fill(0);

    usersGrowth.forEach(user => {
      if (!user.createdAt) return;
      const monthIndex = new Date(user.createdAt).getMonth();
      monthlySales[monthIndex] += 1;
    });

    return this.analyticsService.generateAxisChart('line', {
      series: [{ name: 'role.User', data: monthlySales }],
      categories: this.Month,
      title: 'dashboard.Users Growth',
      colors: ['#2196F3']
    });
  }

    
  private formatPrice(price: number)  : string {
  return this.currencyPipe.transform(price, 'EGP', 'symbol' , '1.0-0') || '';
  }

  private getTotalVisitors() : void {
  this.visitorsService.getTotalVisitors().pipe(takeUntilDestroyed())
  .subscribe(({data}) => this.visitors.set(data));
  }
}