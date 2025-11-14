import { Link, Meta } from ".";
import { Baby, Patient, User } from "./resource";

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

export interface BabyData {
  data: Baby[]; 
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

export interface BabySingleData {
  data: Baby;
}

