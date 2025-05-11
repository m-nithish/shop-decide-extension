import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Collection } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  getUserCollections, 
  createCollection as createCollectionService, 
  deleteCollection as deleteCollectionService,
  addProductToCollection,
  removeProductFromCollection,
  getProductsByCollection as getProductsByCollectionService,
  createProduct as createProductService,
  getUserProducts,
  deleteProduct as deleteProductService,
  getProduct as getProductService
} from '@/services/collectionService';
import { SupabaseCollection, CreateProductParams } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { ensureUUID } from '@/utils/supabaseHelpers';

interface ProductsContextProps {
  products: Product[];
  collections: Collection[];
  addProduct: (product: Omit<Product, 'id' | 'dateAdded'>) => Promise<Product | undefined>;
  deleteProduct: (id: string) => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => Promise<Collection | undefined>;
  deleteCollection: (id: string) => Promise<void>;
  getProductsByCollection: (collectionId: string) => Promise<Product[]>;
  getCollection: (collectionId: string) => Collection | undefined;
  fetchUserCollections: () => Promise<void>;
  fetchUserProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | undefined>;
  isLoading: boolean;
  collectionsLoaded: boolean;
  productsLoaded: boolean;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collectionsLoaded, setCollectionsLoaded] = useState<boolean>(false);
  const [productsLoaded, setProductsLoaded] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Memoize the fetch functions to prevent recreation on re-renders
  const fetchUserCollections = useCallback(async () => {
    if (!user) {
      setCollections([]);
      setCollectionsLoaded(true);
      return;
    }
    
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
      setCollectionsLoaded(true);
    }
  }, [user, toast]);

  const fetchUserProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setProductsLoaded(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await getUserProducts();
      
      if (error) {
        console.error('Error fetching products:', error);
        toast({
          variant: 'destructive',
          title: "Failed to load products",
          description: "There was an error loading your products.",
        });
        return;
      }
      
      if (data) {
        // Convert from Supabase format to our app format
        const formattedProducts: Product[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price || '',
          imageUrl: item.image_url || '',
          productUrl: item.product_url || '',
          sourceName: item.source_name || '',
          dateAdded: item.created_at,
          collectionId: item.collection_id || ''
        }));
        
        setProducts(formattedProducts);
      }
    } catch (err) {
      console.error('Error in fetchUserProducts:', err);
    } finally {
      setIsLoading(false);
      setProductsLoaded(true);
    }
  }, [user, toast]);

  // Load user data when user auth state is resolved and not loading
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        // Only fetch if not already loaded or if user changed
        if (!collectionsLoaded) {
          fetchUserCollections();
        }
        if (!productsLoaded) {
          fetchUserProducts();
        }
      } else {
        // Clear data when no user is logged in
        setProducts([]);
        setCollections([]);
        setCollectionsLoaded(false);
        setProductsLoaded(false);
      }
    }
  }, [user, authLoading, collectionsLoaded, productsLoaded, fetchUserCollections, fetchUserProducts]);

  const getProduct = async (id: string): Promise<Product | undefined> => {
    if (!user) return undefined;
    
    try {
      // First, check if the product is already in state
      const existingProduct = products.find(p => p.id === id);
      if (existingProduct) return existingProduct;
      
      // If not, fetch from Supabase
      const { data, error } = await getProductService(id);
      
      if (error) {
        console.error('Error fetching product:', error);
        return undefined;
      }
      
      if (data && data.length > 0) {
        const item = data[0];
        const product: Product = {
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price || '',
          imageUrl: item.image_url || '',
          productUrl: item.product_url || '',
          sourceName: item.source_name || '',
          dateAdded: item.created_at,
          collectionId: item.collection_id || ''
        };
        
        // Update products array with this product to avoid refetching
        setProducts(prev => {
          if (!prev.some(p => p.id === product.id)) {
            return [...prev, product];
          }
          return prev;
        });
        
        return product;
      }
      
      return undefined;
    } catch (err) {
      console.error('Error in getProduct:', err);
      return undefined;
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'dateAdded'>): Promise<Product | undefined> => {
    try {
      if (!user) {
        toast({
          variant: 'destructive',
          title: "Authentication Required",
          description: "You must be logged in to add products.",
        });
        return undefined;
      }
      
      // Create product in Supabase
      const params: CreateProductParams = {
        p_title: product.title,
        p_description: product.description,
        p_price: product.price,
        p_image_url: product.imageUrl,
        p_product_url: product.productUrl,
        p_source_name: product.sourceName,
        p_collection_id: product.collectionId !== 'none' ? product.collectionId : null
      };
      
      const { data: productId, error } = await createProductService(params);
      
      if (error) {
        console.error('Error creating product:', error);
        toast({
          variant: 'destructive',
          title: "Failed to create product",
          description: "There was an error creating your product.",
        });
        return undefined;
      }
      
      if (productId) {
        // Create a product object with the returned ID
        const newProduct: Product = {
          ...product,
          id: productId,
          dateAdded: new Date().toISOString()
        };
        
        // Add to collection if specified
        if (product.collectionId && product.collectionId !== 'none') {
          await addProductToCollection({
            p_product_id: productId,
            p_collection_id: product.collectionId
          });
        }
        
        // Update the products list
        setProducts(prevProducts => [...prevProducts, newProduct]);
        
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
    }
    return undefined;
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await deleteProductService(id);
      
      if (error) {
        console.error('Error deleting product:', error);
        toast({
          variant: 'destructive',
          title: "Failed to delete product",
          description: "There was an error deleting your product.",
        });
        return;
      }
      
      if (data) {
        setProducts(products.filter(product => product.id !== id));
        toast({
          title: "Product Removed",
          description: "Product has been removed from your collection.",
        });
      }
    } catch (err) {
      console.error('Error in deleteProduct:', err);
      toast({
        variant: 'destructive',
        title: "Failed to delete product",
        description: "An unexpected error occurred.",
      });
    }
  };

  const addCollection = async (collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: "Authentication Required",
        description: "You must be logged in to create collections.",
      });
      return undefined;
    }
    
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
    }
    return undefined;
  };

  const deleteCollection = async (id: string) => {
    if (!user) return;
    
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
        // Also remove products in this collection from local state
        setProducts(products.filter(product => product.collectionId !== id));
        
        toast({
          title: "Collection Deleted",
          description: "Collection and its products have been removed.",
        });
      }
    } catch (err) {
      console.error('Error in deleteCollection:', err);
    }
  };

  const getProductsByCollection = async (collectionId: string): Promise<Product[]> => {
    if (!user) return [];
    
    try {
      // Get products for this collection from Supabase
      const { data, error } = await getProductsByCollectionService(collectionId);
      
      if (error) {
        console.error('Error fetching collection products:', error);
        return [];
      }
      
      if (data && data.length > 0) {
        // Convert Supabase products to our app's Product format
        const formattedProducts: Product[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price || '',
          imageUrl: item.image_url || '',
          productUrl: item.product_url || '',
          sourceName: item.source_name || '',
          dateAdded: item.created_at,
          collectionId: item.collection_id || ''
        }));
        
        return formattedProducts;
      }
      return [];
    } catch (err) {
      console.error('Error in getProductsByCollection:', err);
      return [];
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
        fetchUserProducts,
        getProduct,
        isLoading,
        collectionsLoaded,
        productsLoaded
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
