import { inject, Injectable } from "@angular/core";
import { SingleTonApi } from "../../../../../core/services/single-ton-api.service";
import { Observable } from "rxjs";
import { QueryFilter } from "../../../../../core/interfaces/products.interface";
import { CollectionInfo, ProductsIdsCollectionForHome } from "../../../../../core/interfaces/collections.interface";


@Injectable({providedIn: 'root'},)

export class CollectionsService {
    private readonly singleTonApi = inject(SingleTonApi);
    private readonly endpoint = "collections"


    createCollection(collectionInfo : CollectionInfo , products : Array<{productId : string}>) 
    : Observable<{data :ProductsIdsCollectionForHome , message : string}> {
    return this.singleTonApi.create(this.endpoint , {...collectionInfo , products})
    }

    updateCollection( id : string , collectionInfo : CollectionInfo , products : Array<{productId : string}>) 
    : Observable<{data :ProductsIdsCollectionForHome , message : string}> {
    return this.singleTonApi.updateById(this.endpoint , {...collectionInfo , products} , id)
    }


    getCollections() : Observable<{data : ProductsIdsCollectionForHome[]}> {
    return this.singleTonApi.findData(this.endpoint);
    }
    getCollectionById(id : string) : Observable<{data : ProductsIdsCollectionForHome}> {
    return this.singleTonApi.findDataById(this.endpoint , id);
    }
    
    deleteCollection(ids : string[]) : Observable<void> {
    return this.singleTonApi.deleteByIdWithBody(this.endpoint , ids);
    }

}


