
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCapture from '@/components/ProductCapture';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { useAuth } from '@/context/AuthContext';

const AddProduct = () => {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get('collectionId');
  const { fetchUserCollections } = useProducts();
  const { user } = useAuth();
  
  // Pre-load collections when navigating to this page
  useEffect(() => {
    if (user) {
      fetchUserCollections().catch(err => {
        // Silently handle errors - don't show error toasts
        console.error('Error fetching collections:', err);
      });
    }
  }, [user, fetchUserCollections]);
  
  const backUrl = collectionId ? `/collection/${collectionId}` : '/';
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <div className="mb-6">
          <Link to={backUrl}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-gray-500">Enter the basic information, you can add more details later.</p>
        </div>
        <ProductCapture />
      </main>
    </div>
  );
};

export default AddProduct;
