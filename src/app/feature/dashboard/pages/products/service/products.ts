import { inject, Injectable, signal } from '@angular/core';
import { SingleTonApi } from '../../../../../core/services/single-ton-api.service';
import { Observable } from 'rxjs';
import { Product , ProductCategory, ProductFilter, QueryFilter, SizesType } from '../../../../../core/interfaces/products.interface';
import { Collections, CollectionsResponse } from '../../../../../core/interfaces/collections.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly EndPoint : string = "products";
  private readonly singleTonApi = inject(SingleTonApi);
  

  // Sizes
  sizesNumbers: SizesType[] = ['32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];
  sizesLetters: SizesType[] = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

  CategoryToSizes = signal<Record<ProductCategory , SizesType[]>>({
    APPAREL: this.sizesLetters,
    ACCESSORIES: this.sizesLetters,
    SHOES: this.sizesNumbers,
    OUTERWEAR: this.sizesLetters,
    TROUSERS: this.sizesNumbers,
  });


  collections = signal<Collections>({
    APPAREL: [
      { 'T-SHIRT': ['COMFORT FIT', 'SLIM FIT', 'RELAXED FIT', 'OVERSIZED FIT', 'REGULAR FIT', 'BOX FIT'] },
      { 'SHIRT': ['SLIM', 'OVERSIZED' , ' SHORT SLEEVE', 'REGULAR', 'MODERN', 'TAILORED', 'CLASSIC'] },
      { 'DRESS': ['CASUAL', 'FORMAL', 'PARTY', 'COCKTAIL', 'EVENING', 'SUMMER'] },
      { 'BLOUSE': ['SHORT SLEEVE', 'LONG SLEEVE', 'OFF SHOULDER', 'PEPLUM', 'WRAP', 'RUFFLED'] },
      { 'POLO-SHIRT': ['SLIM', 'OVERSIZED', 'REGULAR', 'COMFORT', 'TEXTURED', 'PIQUÉ'] },
      { 'TANK TOP': ['SPORT', 'CASUAL', 'CROPPED', 'FITTED', 'RELAXED'] },
      { 'SWEATSHIRT': ['HOODED', 'CREWNECK', 'ZIP-UP', 'GRAPHIC', 'OVERSIZED'] },
      { 'PULLOVER': ['ZIP', 'NO ZIP', 'CABLE KNIT', 'WOOL', 'LIGHTWEIGHT'] },
    ],
    ACCESSORIES: [
      { BAG: ['BACKPACK', 'HANDBAG', 'TOTE', 'SATCHEL', 'CLUTCH', 'CROSSBODY'] },
      { WALLET: ['LEATHER', 'FABRIC', 'CARD HOLDER', 'CHAIN WALLET'] },
      { BELT: ['FORMAL', 'CASUAL', 'WOVEN', 'STRETCH'] },
      { HAT: ['CAP', 'BEANIE', 'FEDORA', 'BUCKET', 'SUN HAT'] },
      { SOCKS: ['ANKLE', 'CREW', 'KNEE HIGH', 'NO SHOW', 'THIGH HIGH'] },
    ],
    SHOES: [
      { SNEAKERS: ['LOW-TOP', 'HIGH-TOP', 'SLIP-ON', 'RUNNING', 'RETRO'] },
      { BOOTS: ['ANKLE', 'KNEE-HIGH', 'CHELSEA', 'COMBAT', 'HIKING'] },
      { SANDALS: ['STRAP', 'SLIP-ON', 'GLADIATOR', 'SLIDES'] },
      { LOAFERS: ['LEATHER', 'SUEDE', 'TASSEL', 'PENNY'] },
      { HEELS: ['BLOCK', 'STILETTO', 'KITTEN', 'PLATFORM'] },
    ],
    OUTERWEAR: [
      { JACKET: ['BOMBER' , 'SLIM FIT', 'JACQUARD', 'DENIM', 'PUFFER', 'LEATHER', 'WINDBREAKER', 'CROPPED'] },
      { COAT: ['TRENCH', 'WOOL', 'PARKA', 'PEACOAT'] },
      { BLAZER: ['SINGLE BREASTED', 'DOUBLE BREASTED', 'TAILORED', 'RELAXED'] },
      { HOODIE: ['ZIPPER', 'PULLOVER', 'GRAPHIC', 'FLEECE'] },
      { SWEATER: ['V-NECK', 'ROUND-NECK', 'TURTLENECK', 'CREWNECK', 'CARDIGAN'] },
      { VEST: ['PUFFER', 'COTTON', 'DENIM', 'TAILORED'] },
    ],
    TROUSERS: [
      {
        JEANS: [ 
        'NEW SLIM', 'SUPER SLIM', 'SKINNY', 'SKINNY CROPPED', 'SLOUCHY', 'RELAXED', 'BAGGY',
        'BOYFRIEND', 'BALLON', 'CARGO', 'CARGO LOOSE', 'CARROT', 'L003E', 'STRAIGH', 'FLARED', 'TAPERED', 'MOM',
        ]
      },
      { PANTS: ['CHINOS', 'FORMAL', 'WIDE LEG', 'TAPERED', 'CARGO'] },
      { SHORTS: ['SPORT', 'CARGO', 'DENIM', 'BIKER', 'TAILORED'] },
      { LEGGINGS: ['SPORT', 'CASUAL', 'HIGH WAIST', 'SEAMLESS'] },
      { SKIRT: ['MINI', 'MIDI', 'MAXI', 'PLEATED', 'WRAP', 'DENIM'] },
      { SWEATPANT: ['JOGGER', 'STRAIGHT', 'RELAXED', 'CUFFED'] },
    ],
  });


  // Api
 getProducts( page?: number, limit?: number, filter?: QueryFilter, selectFields? : string):
  Observable<{
  data: {
    products: Product[];
    currentPage: number;
    totalPages: number;
    total: number;
  };
  message: string;
}> {
  const { gender, category, type ,fitType, color, tags, maxPrice, minPrice , sort} = filter || {};

  const buildQueryParam = (key: string, value: string | number | (string | number)[] | undefined) => {
    if (!value) return '';
    if (Array.isArray(value)) {
      return value.map(v => `&${key}=${encodeURIComponent(v)}`).join('');
    }
    return `&${key}=${encodeURIComponent(value)}`;
  };
  
  const queriesFilter =
  buildQueryParam('gender', gender) +
  buildQueryParam('category', category) +
  buildQueryParam('type', type) +
  buildQueryParam('fitType', fitType) +
  buildQueryParam('color', color) +
  buildQueryParam('tags', tags) +
  buildQueryParam('sort', sort) +
  buildQueryParam('minPrice', minPrice) +
  buildQueryParam('maxPrice', maxPrice);  


  return this.singleTonApi.findData(
    `${this.EndPoint}?page=${page}&limit=${limit}${queriesFilter}&selectFields=${selectFields || ''}`
  );
}
  
  getProductsFilters () : Observable<{data : ProductFilter , message : string}> {
  return this.singleTonApi.findData(`${this.EndPoint}/filters`)
  }

  getProductsCollections () : Observable<{ 
  data: CollectionsResponse ,
  message : string
  }> {
  return this.singleTonApi.findData(`${this.EndPoint}/collections`)
  }


  getProductById(productId : string) : Observable<{data : Product , message : string}> {
  return this.singleTonApi.findDataById(this.EndPoint, productId)
  }
  
  getRelatedProducts(productId : string) : Observable<{data : Product[] , message : string}> {
  return this.singleTonApi.findData(`${this.EndPoint}/${productId}/related`)
  }

  createProduct(product : Product) : Observable<{data : Product , message : string}> {
  return this.singleTonApi.create(this.EndPoint , product)
  }
  
  updateProduct(product : Product , productId : string ) : Observable<{data : Product , message : string}> {
  return this.singleTonApi.updateById(this.EndPoint , product , productId)
  }
  
  deleteProducts(productsIds : string[]) : Observable<void>{
  return this.singleTonApi.deleteByIdWithBody(this.EndPoint , productsIds)
  }
  
}
