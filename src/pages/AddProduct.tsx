
import React from 'react';
import Header from '@/components/Header';
import ProductCapture from '@/components/ProductCapture';

const AddProduct = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <ProductCapture />
      </main>
    </div>
  );
};

export default AddProduct;
