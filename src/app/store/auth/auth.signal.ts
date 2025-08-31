import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { authData, Role, User } from "../../core/interfaces/user.interface";
import { computed, inject } from "@angular/core";
import { AuthService } from "../../feature/auth/service/auth.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, of, tap } from "rxjs";
import { Router } from "@angular/router";


interface authState {
    users : User[] ,
    user : User | null,
    isLoading : boolean,
    loginErrorMsg : string,
    registerErrorMsg : string,

    currentPage : number ,
    totalPages: number ,
    totalUsers: number ,
}

const initialState : authState = {
    users : [],
    user : null,
    isLoading : false,
    loginErrorMsg : '' ,
    registerErrorMsg : '' ,

    currentPage : 0 ,
    totalPages: 0 ,
    totalUsers : 0 ,
}

export const AuthStore = signalStore(
    {providedIn : 'root'},
    withState(initialState),
    withComputed((store) => {
    const filterItems = <G>(items : G[]) : G[]  => [...new Set(items)]; 
    return  {
    roles : computed<Role[]>(() => filterItems(store.users().map(({role}) =>  role)))
    }
    }), 
    withMethods((store) => {
    const authService = inject(AuthService);
    const router = inject(Router);
        return {
            
            register(user :  authData) : void {
            authService.register(user).pipe(
            tap(({user}) => {
            this.backToHome();
            patchState(store , ({user , registerErrorMsg : ''}))
            }),
            catchError(({error}) => {
            patchState(store , ({registerErrorMsg : error.message}))
            return of(null)
            }) 
            )
            .subscribe()
            },

            login(user :  authData) : void {
            authService.login(user).pipe(
            tap(({user}) => {
            this.backToHome();
            patchState(store , ({user , loginErrorMsg : ''}))
            }),
            catchError(({error}) => {
            patchState(store , ({loginErrorMsg : error.message}))
            return of(null)
            }) 
            ).subscribe();
            },

            getAllUsers () : void {
            if(store.users().length > 0) return ;
            patchState(store , {isLoading : true})
            authService.getAllUsers().pipe(
                tap(({data}) => { 
                const {users , currentPage , totalPages ,total : totalUsers} = data ;
                const allUsers = 
                users.sort((user) => user.role === 'Admin' && user.email === store.user()?.email ? -1 : 1)

                patchState(store , {isLoading : false , users : allUsers, currentPage , totalPages , totalUsers})
                }),
                catchError(() => {
                patchState(store , {isLoading : false})
                return  of([])
                }),
                takeUntilDestroyed()
            ).subscribe();
            },

            getUserProfile  () : void {
            if(store.user()) return ;
            patchState(store , {isLoading : true});
            authService.getProfile().pipe(
                tap(({user}) => {
                patchState(store , {user , isLoading : false});
                }),
                catchError(() =>  of(null)),
                takeUntilDestroyed()
                ).subscribe();
            },

        deleteUsers(ids: string[]) : void {
        if (ids.length === 0) return;
        authService.deleteUsers(ids).pipe(
        tap(() => {
        const users = store.users().filter(user => !ids.includes(user.id || ''));
        patchState(store , {users})
        }),
        catchError(() => of(null))
        ).subscribe();
        },

        backToHome() : void {
        router.navigateByUrl('/main/home')
        },
        
        clearErrorMsgs() : void {
        patchState(store , ({registerErrorMsg : '' , loginErrorMsg : ''}))
        }
        }
        
    })

)


