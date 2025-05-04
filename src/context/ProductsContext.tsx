
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Collection } from '../types';
import { products as initialProducts, collections as initialCollections } from '../utils/mockData';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  getUserCollections, 
  createCollection as createCollectionService, 
  deleteCollection as deleteCollectionService,
  addProductToCollection,
  removeProductFromCollection,
  getProductsByCollection as getProductsByCollectionService,
  createProduct as createProductService
} from '@/services/collectionService';
import { SupabaseCollection, CreateProductParams } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

interface ProductsContextProps {
  products: Product[];
  collections: Collection[];
  addProduct: (product: Omit<Product, 'id' | 'dateAdded'>) => Promise<Product | undefined>;
  deleteProduct: (id: string) => void;
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => Promise<Collection | undefined>;
  deleteCollection: (id: string) => Promise<void>;
  getProductsByCollection: (collectionId: string) => Promise<Product[]>;
  getCollection: (collectionId: string) => Collection | undefined;
  fetchUserCollections: () => Promise<void>;
  isLoading: boolean;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

    // Fetch user collections from Supabase if user is logged in
    if (user) {
      fetchUserCollections();
    }
  }, [user]);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [products, collections]);

  // Fetch user collections from Supabase
  const fetchUserCollections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await getUserCollections();
      
      if (error) {
        console.error('Error fetching collections:', error);
        toast({
          variant: 'destructive',
          title: "Failed to load collections",
          description: "There was an error loading your collections.",
        });
        return;
      }
      
      if (data) {
        // Convert from Supabase format to our app format
        const formattedCollections: Collection[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          createdAt: item.created_at,
          color: item.color,
          productCount: 0 // We'll update this later when needed
        }));
        
        setCollections(formattedCollections);
      }
    } catch (err) {
      console.error('Error in fetchUserCollections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'dateAdded'>): Promise<Product | undefined> => {
    try {
      if (user) {
        // If authenticated, create product in Supabase
        const params: CreateProductParams = {
          p_user_id: user.id,
          p_title: product.title,
          p_description: product.description,
          p_price: product.price,
          p_image_url: product.imageUrl,
          p_product_url: product.productUrl,
          p_source_name: product.sourceName
        };
        
        const { data, error } = await createProductService(params);
        
        if (error) {
          console.error('Error creating product:', error);
          toast({
            variant: 'destructive',
            title: "Failed to create product",
            description: "There was an error creating your product.",
          });
          return undefined;
        }
        
        if (data) {
          // Get the new product ID
          const productId: string = data;
          
          // Create a product object with the returned ID
          const newProduct: Product = {
            ...product,
            id: productId,
            dateAdded: new Date().toISOString()
          };
          
          // Add to collection if specified
          if (product.collectionId) {
            await addProductToCollection({
              p_product_id: productId,
              p_collection_id: product.collectionId
            });
          }
          
          setProducts([...products, newProduct]);
          
          toast({
            title: "Product Added",
            description: "Product has been added to your collection.",
          });
          
          return newProduct;
        }
      } else {
        // Not authenticated, use local storage
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
        
        return newProduct;
      }
    } catch (err) {
      console.error('Error in addProduct:', err);
      toast({
        variant: 'destructive',
        title: "Failed to create product",
        description: "An unexpected error occurred.",
      });
      return undefined;
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product Removed",
      description: "Product has been removed from your collection.",
    });
  };

  const addCollection = async (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => {
    if (user) {
      // Save to Supabase if user is authenticated
      try {
        const { data, error } = await createCollectionService({
          p_name: collection.name,
          p_description: collection.description,
          p_color: collection.color
        });
        
        if (error) {
          console.error('Error creating collection:', error);
          toast({
            variant: 'destructive',
            title: "Failed to create collection",
            description: "There was an error creating your collection.",
          });
          return undefined;
        }
        
        if (data) {
          // Fetch the updated collections
          await fetchUserCollections();
          
          toast({
            title: "Collection Created",
            description: "New collection has been created.",
          });
          
          // Find and return the newly created collection
          const newCollections = await getUserCollections();
          if (newCollections.data) {
            const newCollection = newCollections.data.find(c => c.name === collection.name);
            if (newCollection) {
              return {
                id: newCollection.id,
                name: newCollection.name,
                description: newCollection.description || '',
                createdAt: newCollection.created_at,
                color: newCollection.color,
                productCount: 0
              };
            }
          }
        }
      } catch (err) {
        console.error('Error in addCollection:', err);
        return undefined;
      }
    } else {
      // Use local storage if not authenticated
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
      
      return newCollection;
    }
  };

  const deleteCollection = async (id: string) => {
    if (user) {
      // Delete from Supabase if user is authenticated
      try {
        const { data, error } = await deleteCollectionService(id);
        
        if (error) {
          console.error('Error deleting collection:', error);
          toast({
            variant: 'destructive',
            title: "Failed to delete collection",
            description: "There was an error deleting your collection.",
          });
          return;
        }
        
        if (data) {
          // Remove from local state
          setCollections(collections.filter(collection => collection.id !== id));
          // Also remove products in this collection
          setProducts(products.filter(product => product.collectionId !== id));
          
          toast({
            title: "Collection Deleted",
            description: "Collection and its products have been removed.",
          });
        }
      } catch (err) {
        console.error('Error in deleteCollection:', err);
      }
    } else {
      // Use local storage if not authenticated
      setCollections(collections.filter(collection => collection.id !== id));
      // Also remove products in this collection
      setProducts(products.filter(product => product.collectionId !== id));
      toast({
        title: "Collection Deleted",
        description: "Collection and its products have been removed.",
      });
    }
  };

  const getProductsByCollection = async (collectionId: string): Promise<Product[]> => {
    if (user) {
      try {
        // Get product IDs for this collection from Supabase
        const { data, error } = await getProductsByCollectionService(collectionId);
        
        if (error) {
          console.error('Error fetching collection products:', error);
          return [];
        }
        
        if (data && data.length > 0) {
          // Filter local products matching the returned IDs
          const productIds = data.map(item => item.product_id);
          return products.filter(product => productIds.includes(product.id));
        }
        return [];
      } catch (err) {
        console.error('Error in getProductsByCollection:', err);
        return [];
      }
    } else {
      // Use local storage if not authenticated
      return products.filter(product => product.collectionId === collectionId);
    }
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
        getCollection,
        fetchUserCollections,
        isLoading
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
