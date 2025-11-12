export interface FormUser {
  name: string;
  email: string;
  role_id: string;
  password?: string;
  password_confirmation?: string;
  [key: string]: any;
}