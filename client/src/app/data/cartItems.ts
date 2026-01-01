export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string; // Added this field
  imageUrl?: string;
}

export const sampleCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Jollof Rice',
    price: 3500,
    quantity: 2,
    category: 'Rice Meals', // Added category
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    name: 'Chicken Suya',
    price: 2000,
    quantity: 1,
    category: 'Chicken', // Added category
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 3,
    name: 'Fried Plantain',
    price: 1000,
    quantity: 3,
    category: 'Sides', // Added category
    imageUrl: 'https://www.runningtothekitchen.com/wp-content/uploads/2024/04/fried-plantains-msn-1.jpg', // (Truncated for brevity)
  },
];