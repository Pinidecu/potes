// Sample data for the Potes application
export interface Ingredient {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Salad {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  ingredients: string[];
  isActive: boolean;
}

export interface CartItem extends Salad {
  removedIngredients: string[];
  addedIngredients: Ingredient[];
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  gpsLocation: string;
  items: CartItem[];
  total: number;
  status: 'Pendiente' | 'Preparado' | 'En entrega' | 'Completado';
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  text: string;
  image?: string;
  rating: number;
}

export const ingredients: Ingredient[] = [
  { id: '1', name: 'Lechuga', price: 0, category: 'Base' },
  { id: '2', name: 'Tomate', price: 200, category: 'Vegetal' },
  { id: '3', name: 'Pepino', price: 150, category: 'Vegetal' },
  { id: '4', name: 'Zanahoria', price: 150, category: 'Vegetal' },
  { id: '5', name: 'Cebolla morada', price: 100, category: 'Vegetal' },
  { id: '6', name: 'Palta', price: 300, category: 'Premium' },
  { id: '7', name: 'Queso', price: 400, category: 'Proteína' },
  { id: '8', name: 'Pollo grillado', price: 600, category: 'Proteína' },
  { id: '9', name: 'Atún', price: 500, category: 'Proteína' },
  { id: '10', name: 'Huevo duro', price: 200, category: 'Proteína' },
  { id: '11', name: 'Croutons', price: 150, category: 'Extra' },
  { id: '12', name: 'Semillas de girasol', price: 200, category: 'Extra' },
];

export const salads: Salad[] = [
  {
    id: '1',
    name: 'Ensalada César',
    description: 'Clásica ensalada con lechuga, croutons, queso parmesano y pollo grillado',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1200,
    ingredients: ['1', '7', '8', '11'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Ensalada Mediterránea',
    description: 'Fresh mix con tomate, pepino, cebolla morada y queso',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1000,
    ingredients: ['1', '2', '3', '5', '7'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Ensalada Tropical',
    description: 'Mix de verdes con palta, zanahoria y semillas',
    image: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1100,
    ingredients: ['1', '4', '6', '12'],
    isActive: true,
  },
  {
    id: '4',
    name: 'Ensalada Proteica',
    description: 'Base de lechuga con pollo, huevo duro y queso',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1300,
    ingredients: ['1', '7', '8', '10'],
    isActive: true,
  },
  {
    id: '5',
    name: 'Ensalada del Mar',
    description: 'Refrescante ensalada con atún, tomate y pepino',
    image: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1150,
    ingredients: ['1', '2', '3', '9'],
    isActive: true,
  },
  {
    id: '6',
    name: 'Ensalada Completa',
    description: 'Mix completo con todos nuestros ingredientes frescos',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 1400,
    ingredients: ['1', '2', '3', '4', '5', '6', '7', '8'],
    isActive: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    customerName: 'María González',
    text: 'Las ensaladas más frescas que he probado. La personalización es increíble!',
    rating: 5,
  },
  {
    id: '2',
    customerName: 'Carlos Rodríguez',
    text: 'Excelente servicio y calidad. Siempre llegan a tiempo y muy frescas.',
    rating: 5,
  },
  {
    id: '3',
    customerName: 'Ana Martínez',
    text: 'Me encanta poder personalizar mis ensaladas. Los ingredientes son súper frescos.',
    rating: 5,
  },
  {
    id: '4',
    customerName: 'Jorge Silva',
    text: 'Perfecto para mantener una alimentación saludable. Muy recomendable!',
    rating: 5,
  },
];

export const bannerImages = [
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800',
];