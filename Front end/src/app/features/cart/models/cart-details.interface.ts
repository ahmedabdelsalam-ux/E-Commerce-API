export interface CartDetailsRespons {
  status: string;
  data: CartDetails;
}

export interface CartDetails {
  _id: string;
  products: CartProduct[];
  totalCartPrice: number;
}

export interface CartProduct {
  _id: string;
  quantity: number;
  product: Product;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageCover: string;
  category: string;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
}