import { Link, Meta } from ".";
import { Patient, User } from "./resource";

export interface UserData {
  data: User[];
  meta: Meta;
  link: Link;
}

export interface PatientData {
  data: Patient[];
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

export interface PatientSingleData {
  data: Patient;
}

