import { inject, Injectable, signal } from "@angular/core";
import { DashboardLinks } from "./shared/interfaces/dashboardLinks";
import { SingleTonApi } from "../../core/services/single-ton-api.service";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly singleTonApi = inject(SingleTonApi);
    
    dashboardSideLinks = signal<DashboardLinks[]>([
        {
            id : 1 ,
            name: 'navigation.Dashboard',
            path: '/dashboard/home',
            icon: 'dashboard'
        },
        {
            id : 2 ,
            name: 'navigation.Analytics',
            path: '/dashboard/analytics',
            icon: 'analytics'
        },
        {
            id : 3 ,
            name: 'navigation.Products',
            path: '/dashboard/products',
            icon: 'inventory'
        },
        {
            id : 4 ,
            name: 'navigation.Collections',
            path: '/dashboard/collections',
            icon: 'collections'
        },
        {
            id : 5 ,
            name: 'navigation.Orders',
            path: '/dashboard/orders',
            icon: 'shopping_basket'
        },
        {
            id : 6 ,
            name: 'navigation.Users',
            path: '/dashboard/users',
            icon: 'people'
        },
        {
            id : 7 ,
            name: 'navigation.Settings',
            path: '/dashboard/settings',
            icon: 'settings',
        },

    ]).asReadonly();


    isAdmin() : Observable<boolean> {
    return this.singleTonApi.findData('dashboard').pipe(
    map((value) => value ? true : false)
    );
    }



    
}