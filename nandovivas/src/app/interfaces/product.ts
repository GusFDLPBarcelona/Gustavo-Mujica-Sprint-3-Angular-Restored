export interface Product {
  id?: number;
  name: string;
  description: string;
  image: string;
  prices?: { id: number; price: number }[]; // ✅ Lista de precios según variante
  sizes?: { id: number; size: string; stock: number }[];
  colors?: { id: number; color: string }[];
  images?: string[];
  category?: { id: number; name: string }; // ✅ Relación con la tabla `categories`
}
