export interface Product {
    id?: string; // El ID de Firestore es un string
    name: string;
    description: string;
    image: string;
    price: number;
    sizes?: { id: number; size: string; stock: number }[];
    colors?: { id: number; color: string }[];
    images?: string[];
    category?: { id: number; name: string };
  }