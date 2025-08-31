export interface MenuItems {
    id :  number | string ;
    title : string;
    path : string;
    queryParams? : {
    [key : string] : string | number | boolean;
    }
    items? : MenuItems[]
}

export interface Menu {
    title : string;
    items : MenuItems[]
}