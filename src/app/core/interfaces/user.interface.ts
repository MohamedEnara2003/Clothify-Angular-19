export type Role = "User"  | "Moderator" | "Admin" | "SuperAdmin"; 

export interface authData {
  fullName? : string ,
  email : string ,
  password : string ,
}

export interface User {
  id : string ,
  fullName : string ,
  email : string ,
  role : Role,
  createdAt : string ,
  isActive : boolean ,
}

export interface UserData {
  message : string ,
  users : User[] ,
}