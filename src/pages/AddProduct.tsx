
import React from 'react';
import Header from '@/components/Header';
import ProductCapture from '@/components/ProductCapture';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddProduct = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
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
