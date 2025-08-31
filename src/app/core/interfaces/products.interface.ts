import { UploadImage } from "./files.interface";

export type Sort =  'Default' | 'Newest' | 'Oldest' | 'LowtoHigh' | 'HightoLow' ;

export type ProductCategory = 'APPAREL' | 'ACCESSORIES' | 'SHOES'| 'OUTERWEAR' | 'TROUSERS';
export type Gender = 'MEN' | 'WOMEN' | 'KIDS' | 'NONE';
export type Tags = 'New'| 'Sale'| 'Popular'| 'Limited'| 'Featured'| 'Best Seller';




export type SizesType = 
'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | '5XL' |
'32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48' ;


export interface Types {
    category : ProductCategory,
    types : string[],
}

export interface ProductSize {
_id? :string ,
size : string ,
stock : number
}


export interface Product {
_id? : string ,
createdAt? : Date ,
name : string ,
images  : UploadImage[] ,
price : number ,
final_price? : number ,
discound : number ,
color : string ,
category : ProductCategory ,
type : string ,
fitType	 : string ,
gender : Gender ,
description : string ,
sizes : ProductSize[]
stock? : number;
tags : Tags[] ,
}

export interface ProductFilter {
filterData : Array<{title : string , items : string[]}> ,
prices : {minPrice : number , maxPrice : number}[],
}

export interface QueryFilter {
  gender? : Gender | Gender[] ,
  category? : ProductCategory | ProductCategory[] ,
  type? : string | string[] ,
  fitType? : string | string[] ,
  color? : string | string[] ,
  tags? : Tags | Tags[],
  minPrice? : number ,
  maxPrice? : number ,
  sort? : Sort  ,
}


