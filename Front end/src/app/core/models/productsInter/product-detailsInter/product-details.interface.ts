export interface ProductDetailsResponse {
  message: string;
  product: ProductDetails;
}

export interface ProductDetails {
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
