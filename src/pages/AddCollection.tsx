
import React from 'react';
import Header from '@/components/Header';
import CollectionForm from '@/components/CollectionForm';

const AddCollection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Collection</h1>
        <CollectionForm />
      </main>
    </div>
  );
};

export default AddCollection;
