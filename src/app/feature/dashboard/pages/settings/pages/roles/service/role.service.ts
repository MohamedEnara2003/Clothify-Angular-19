import { inject, Injectable } from "@angular/core";
import { SingleTonApi } from "../../../../../../../core/services/single-ton-api.service";
import { Observable } from "rxjs";
import { Role } from "../../../../../../../core/interfaces/user.interface";


export interface RoleDataType {
    id?: string;
    email: string;
    password: string;
    role: Role;
}

@Injectable()

export class RoleService {
    private readonly singleTonApi = inject(SingleTonApi);
    private readonly endpoint = 'roles';

    createRole(roleDataType : RoleDataType) : Observable<{role : RoleDataType , message : string}> {
    return this.singleTonApi.create(this.endpoint, roleDataType);
    }

    getRoles() : Observable<{ 
    data : {roles : RoleDataType[] , currentPage  : string ,totalPages : number,total : number} ,
    message : string}> {
    return this.singleTonApi.findData(this.endpoint);
    }

    deleteRole(ids: string[]): Observable<void> {
    return this.singleTonApi.deleteByIdWithBody(this.endpoint, ids);
    }

}