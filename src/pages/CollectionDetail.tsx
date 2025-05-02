
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductsContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, getProductsByCollection, deleteCollection } = useProducts();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const collection = collections.find(c => c.id === id);
  
  useEffect(() => {
    const loadProducts = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const collectionProducts = await getProductsByCollection(id);
          setProducts(collectionProducts);
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadProducts();
  }, [id, getProductsByCollection]);
  
  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
          <p className="mb-6">The collection you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const formattedDate = new Date(collection.createdAt).toLocaleDateString();
  
  const handleDelete = async () => {
    await deleteCollection(collection.id);
    navigate('/collections');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: collection.color }}
                ></div>
                <h1 className="text-2xl font-bold">{collection.name}</h1>
              </div>
              <p className="text-gray-500 mt-1">Created on {formattedDate}</p>
            </div>
            
            <div className="flex gap-2">
              <Link to={{
                pathname: "/add-product",
                search: id ? `?collectionId=${id}` : ""
              }}>
                <Button className="bg-theme-purple hover:bg-theme-purple/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </Link>
              <Button 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete Collection
              </Button>
            </div>
          </div>
          
          {collection.description && (
            <p className="mt-4 text-gray-700">{collection.description}</p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-purple"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-theme-lavender rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-theme-purple" />
            </div>
            <h3 className="text-lg font-medium mb-2">No products in this collection</h3>
            <p className="text-gray-500 mb-6">Start adding products to this collection</p>
            <Link to="/add-product">
              <Button className="bg-theme-purple hover:bg-theme-purple/90">
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionDetail;
