export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock?: number;
  sizes: {
    id: number | null;
    size: string | null; 
    stock: number;
    selected?: boolean; 
  }[];
  colors: { id: number; color: string }[];
  images: string[];
  category: {
    toLowerCase(): unknown; id: number; name: string 
};
}