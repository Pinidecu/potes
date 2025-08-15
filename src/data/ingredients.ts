import { Ingredient } from '../types';

export const ingredients: Ingredient[] = [
  // Verduras
  { id: 'lechuga', name: 'Lechuga', price: 0, category: 'verdura' },
  { id: 'tomate', name: 'Tomate', price: 200, category: 'verdura' },
  { id: 'pepino', name: 'Pepino', price: 150, category: 'verdura' },
  { id: 'zanahoria', name: 'Zanahoria', price: 150, category: 'verdura' },
  { id: 'cebolla-morada', name: 'Cebolla Morada', price: 100, category: 'verdura' },
  { id: 'palta', name: 'Palta', price: 400, category: 'verdura' },
  { id: 'rucula', name: 'Rúcula', price: 200, category: 'verdura' },
  { id: 'repollo-morado', name: 'Repollo Morado', price: 150, category: 'verdura' },

  // Proteínas
  { id: 'pollo-grillado', name: 'Pollo Grillado', price: 800, category: 'proteina' },
  { id: 'salmón', name: 'Salmón', price: 1200, category: 'proteina' },
  { id: 'atun', name: 'Atún', price: 600, category: 'proteina' },
  { id: 'huevo-duro', name: 'Huevo Duro', price: 300, category: 'proteina' },
  { id: 'queso-fresco', name: 'Queso Fresco', price: 400, category: 'proteina' },
  { id: 'garbanzos', name: 'Garbanzos', price: 300, category: 'proteina' },

  // Cereales
  { id: 'quinoa', name: 'Quinoa', price: 400, category: 'cereal' },
  { id: 'arroz-integral', name: 'Arroz Integral', price: 300, category: 'cereal' },
  { id: 'semillas-girasol', name: 'Semillas de Girasol', price: 250, category: 'cereal' },
  { id: 'croutons', name: 'Croutons', price: 200, category: 'cereal' },

  // Frutas
  { id: 'manzana', name: 'Manzana', price: 250, category: 'fruta' },
  { id: 'arandanos', name: 'Arándanos', price: 500, category: 'fruta' },
  { id: 'frutillas', name: 'Frutillas', price: 400, category: 'fruta' },

  // Aderezos
  { id: 'vinagreta', name: 'Vinagreta', price: 0, category: 'aderezo' },
  { id: 'cesar', name: 'Aderezo César', price: 100, category: 'aderezo' },
  { id: 'miel-mostaza', name: 'Miel y Mostaza', price: 100, category: 'aderezo' },
  { id: 'yogurt-natural', name: 'Yogurt Natural', price: 150, category: 'aderezo' },
];