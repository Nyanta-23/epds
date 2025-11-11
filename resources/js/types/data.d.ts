import { Link, Meta } from ".";
import { User } from "./resource";

export interface UserData {
  data: User[];
  meta: Meta;
  link: Link;
}



// 
export interface UserSingleData {
  data: User;
}

export interface RoleSingleData {
  data: Role;
}

