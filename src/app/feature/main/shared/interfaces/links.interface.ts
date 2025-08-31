export interface Links {
    name : string;
    path : string;
    queryParams? : Record<string , string | undefined>;
    styleClass? : string;
    icon? : string;
}