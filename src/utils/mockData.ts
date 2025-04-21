
import { Product, Collection } from '../types';

// Sample collections
export const collections: Collection[] = [
  {
    id: '1',
    name: 'Smartphones',
    description: 'Looking for the best smartphone for my needs',
    createdAt: '2024-04-10T12:00:00Z',
    color: '#8B5CF6',
    productCount: 3
  },
  {
    id: '2',
    name: 'Laptops',
    description: 'Comparing laptops for work and gaming',
    createdAt: '2024-04-12T15:30:00Z',
    color: '#EF4444',
    productCount: 2
  },
  {
    id: '3',
    name: 'Home Decor',
    description: 'Ideas for the living room',
    createdAt: '2024-04-15T09:15:00Z',
    color: '#10B981',
    productCount: 2
  }
];

// Sample products
export const products: Product[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max',
    description: 'Apple iPhone 13 Pro Max, 256GB, Sierra Blue - Unlocked',
    price: '$999.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=iPhone+13',
    productUrl: 'https://example.com/iphone13',
    sourceName: 'Apple Store',
    dateAdded: '2024-04-10T14:30:00Z',
    collectionId: '1'
  },
  {
    id: '2',
    title: 'Samsung Galaxy S22 Ultra',
    description: 'Samsung Galaxy S22 Ultra, 512GB, Phantom Black - Unlocked',
    price: '$1,199.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=Galaxy+S22',
    productUrl: 'https://example.com/galaxys22',
    sourceName: 'Samsung',
    dateAdded: '2024-04-11T10:15:00Z',
    collectionId: '1'
  },
  {
    id: '3',
    title: 'Google Pixel 6 Pro',
    description: 'Google Pixel 6 Pro, 128GB, Stormy Black - Unlocked',
    price: '$899.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=Pixel+6+Pro',
    productUrl: 'https://example.com/pixel6pro',
    sourceName: 'Google Store',
    dateAdded: '2024-04-12T09:45:00Z',
    collectionId: '1'
  },
  {
    id: '4',
    title: 'MacBook Pro 14"',
    description: 'Apple MacBook Pro 14-inch, M1 Pro chip, 16GB RAM, 512GB SSD',
    price: '$1,999.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=MacBook+Pro',
    productUrl: 'https://example.com/macbookpro',
    sourceName: 'Apple Store',
    dateAdded: '2024-04-13T16:20:00Z',
    collectionId: '2'
  },
  {
    id: '5',
    title: 'Dell XPS 15',
    description: 'Dell XPS 15, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA RTX 3050 Ti',
    price: '$2,199.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=Dell+XPS+15',
    productUrl: 'https://example.com/dellxps15',
    sourceName: 'Dell',
    dateAdded: '2024-04-14T11:10:00Z',
    collectionId: '2'
  },
  {
    id: '6',
    title: 'Modern Coffee Table',
    description: 'Mid-Century Modern Coffee Table with Storage, Walnut Finish',
    price: '$349.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=Coffee+Table',
    productUrl: 'https://example.com/coffeetable',
    sourceName: 'Wayfair',
    dateAdded: '2024-04-15T13:50:00Z',
    collectionId: '3'
  },
  {
    id: '7',
    title: 'Floor Lamp',
    description: 'Modern Arc Floor Lamp with Marble Base, Brushed Brass Finish',
    price: '$179.99',
    imageUrl: 'https://placehold.co/400x300/E5DEFF/8B5CF6?text=Floor+Lamp',
    productUrl: 'https://example.com/floorlamp',
    sourceName: 'West Elm',
    dateAdded: '2024-04-16T15:25:00Z',
    collectionId: '3'
  }
];
