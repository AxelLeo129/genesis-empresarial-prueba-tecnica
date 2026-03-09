export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dpi: string;
  birthDate?: string;
  address?: string;
  department?: string;
  municipality?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  dpi: string;
  birthDate?: string;
  address?: string;
  department?: string;
  municipality?: string;
  avatarUrl?: string;
}
