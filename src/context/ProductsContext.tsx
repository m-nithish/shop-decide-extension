
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Collection } from '../types';
import { products as initialProducts, collections as initialCollections } from '../utils/mockData';
import { useToast } from '@/components/ui/use-toast';

interface ProductsContextProps {
  products: Product[];
  collections: Collection[];
  addProduct: (product: Omit<Product, 'id' | 'dateAdded'>) => Product;
  deleteProduct: (id: string) => void;
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => void;
  deleteCollection: (id: string) => void;
  getProductsByCollection: (collectionId: string) => Product[];
  getCollection: (collectionId: string) => Collection | undefined;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const { toast } = useToast();

  // Load from localStorage on init
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCollections = localStorage.getItem('collections');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [products, collections]);

  const addProduct = (product: Omit<Product, 'id' | 'dateAdded'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      dateAdded: new Date().toISOString()
    };
    
    setProducts([...products, newProduct]);
    toast({
      title: "Product Added",
      description: "Product has been added to your collection.",
    });
    
    return newProduct; // Return the new product object
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Removed",
      description: "Product has been removed from your collection.",
    });
  };

  const addCollection = (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => {
    const newCollection: Collection = {
      ...collection,
      id: `collection-${Date.now()}`,
      createdAt: new Date().toISOString(),
      productCount: 0
    };
    
    setCollections([...collections, newCollection]);
    toast({
      title: "Collection Created",
      description: "New collection has been created.",
    });
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(collection => collection.id !== id));
    // Also remove products in this collection or move them to "uncategorized"
    setProducts(products.filter(product => product.collectionId !== id));
    toast({
      title: "Collection Deleted",
      description: "Collection and its products have been removed.",
    });
  };

  const getProductsByCollection = (collectionId: string) => {
    return products.filter(product => product.collectionId === collectionId);
  };

  const getCollection = (collectionId: string) => {
    return collections.find(collection => collection.id === collectionId);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        collections,
        addProduct,
        deleteProduct,
        addCollection,
        deleteCollection,
        getProductsByCollection,
        getCollection
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
