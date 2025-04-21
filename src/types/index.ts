
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  productUrl: string;
  sourceName: string;
  dateAdded: string;
  collectionId: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  color: string;
  productCount?: number;
}
