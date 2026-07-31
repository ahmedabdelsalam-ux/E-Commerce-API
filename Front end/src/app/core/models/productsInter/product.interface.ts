export interface ProductResponse {
  message: string;
  products: Product[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageCover: string;
  ratingsAverage: number;

  category: Category;

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  image: string;

  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
