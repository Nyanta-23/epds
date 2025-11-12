export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
}