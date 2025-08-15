// Tipos para la aplicación
export interface Ingredient {
  id: string;
  name: string;
  price: number;
  category: 'verdura' | 'proteina' | 'cereal' | 'fruta' | 'aderezo';
}

export interface Salad {
  id: string;
  name: string;
  description: string;
  image: string;
  baseIngredients: string[];
  basePrice: number;
  active: boolean;
}

export interface CartItem {
  salad: Salad;
  selectedIngredients: string[];
  extraIngredients: string[];
  quantity: number;
  totalPrice: number;
  id: string;
}

export interface Customer {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  gps: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: 'Pendiente' | 'Preparado' | 'En entrega' | 'Completado';
  date: string;
  time: string;
}

export interface AdminUser {
  username: string;
  password: string;
}