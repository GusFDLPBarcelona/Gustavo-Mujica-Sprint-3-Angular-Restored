export interface ProductSize {
  label: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex?: string;
  image: string;
  sizes?: ProductSize[];
  stock?: number;
}

export interface Product {
  id?: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  hasSizes: boolean;
  hasColors: boolean;
  colors?: ProductColor[];
  sizes?: ProductSize[];
  stock?: number;
  active: boolean;
  order?: number;
  altText?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  maxStock: number;
}

export interface ShopSettings {
  categories: string[];
}
