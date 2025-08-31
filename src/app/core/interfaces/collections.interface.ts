import { Product, QueryFilter } from "./products.interface";

// Collections For Products
export type Collections = {
  APPAREL: [
    { 'T-SHIRT': ['COMFORT FIT', 'SLIM FIT', 'RELAXED FIT', 'OVERSIZED FIT', 'REGULAR FIT', 'BOX FIT'] },
    { 'SHIRT': ['SLIM', 'OVERSIZED' , ' SHORT SLEEVE', 'REGULAR', 'MODERN', 'TAILORED', 'CLASSIC' ,] },
    { 'DRESS': ['CASUAL', 'FORMAL', 'PARTY', 'COCKTAIL', 'EVENING', 'SUMMER'] },
    { 'BLOUSE': ['SHORT SLEEVE', 'LONG SLEEVE', 'OFF SHOULDER', 'PEPLUM', 'WRAP', 'RUFFLED'] },
    { 'POLO-SHIRT': ['SLIM', 'OVERSIZED', 'REGULAR', 'COMFORT', 'TEXTURED', 'PIQUÉ'] },
    { 'TANK TOP': ['SPORT', 'CASUAL', 'CROPPED', 'FITTED', 'RELAXED'] },
    { 'SWEATSHIRT': ['HOODED', 'CREWNECK', 'ZIP-UP', 'GRAPHIC', 'OVERSIZED'] },
    { 'PULLOVER': ['ZIP', 'NO ZIP', 'CABLE KNIT', 'WOOL', 'LIGHTWEIGHT'] },
  ];
  ACCESSORIES: [
    { BAG: ['BACKPACK', 'HANDBAG', 'TOTE', 'SATCHEL', 'CLUTCH', 'CROSSBODY'] },
    { WALLET: ['LEATHER', 'FABRIC', 'CARD HOLDER', 'CHAIN WALLET'] },
    { BELT: ['FORMAL', 'CASUAL', 'WOVEN', 'STRETCH'] },
    { HAT: ['CAP', 'BEANIE', 'FEDORA', 'BUCKET', 'SUN HAT'] },
    { SOCKS: ['ANKLE', 'CREW', 'KNEE HIGH', 'NO SHOW', 'THIGH HIGH'] },
  ];
  SHOES: [
    { SNEAKERS: ['LOW-TOP', 'HIGH-TOP', 'SLIP-ON', 'RUNNING', 'RETRO'] },
    { BOOTS: ['ANKLE', 'KNEE-HIGH', 'CHELSEA', 'COMBAT', 'HIKING'] },
    { SANDALS: ['STRAP', 'SLIP-ON', 'GLADIATOR', 'SLIDES'] },
    { LOAFERS: ['LEATHER', 'SUEDE', 'TASSEL', 'PENNY'] },
    { HEELS: ['BLOCK', 'STILETTO', 'KITTEN', 'PLATFORM'] },
  ];
  OUTERWEAR: [
    { JACKET: ['BOMBER', 'SLIM FIT' , 'JACQUARD','DENIM', 'PUFFER', 'LEATHER', 'WINDBREAKER', 'CROPPED'] },
    { COAT: ['TRENCH', 'WOOL', 'PARKA', 'PEACOAT'] },
    { BLAZER: ['SINGLE BREASTED', 'DOUBLE BREASTED', 'TAILORED', 'RELAXED'] },
    { HOODIE: ['ZIPPER', 'PULLOVER', 'GRAPHIC', 'FLEECE'] },
    { SWEATER: ['V-NECK', 'ROUND-NECK', 'TURTLENECK', 'CREWNECK', 'CARDIGAN'] },
    { VEST: ['PUFFER', 'COTTON', 'DENIM', 'TAILORED'] },
  ];
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
  ];
};


// Menu 
export interface CategoryWithTypes {
  category: string;
  items: string[]; // array of types
}

export interface MenuByGender {
  [gender: string]: CategoryWithTypes[];
}

export interface MenuByFit {
  [type: string]: string[]; // array of fit types
}

export interface CollectionsResponse {
  byGender: MenuByGender;
  byFit: MenuByFit;
}


// Collections For Home

export interface CollectionInfo {
  _id? : string ,
  queries : QueryFilter,
  titleEn : string,
  titleAr : string,
  createdAt? : string,
}

export interface ProductsIdsCollectionForHome extends CollectionInfo{
  products : Array<{productId : Product[]}>
}

export interface ProductsCollectionForHome extends CollectionInfo{
  products : Product[]
}
