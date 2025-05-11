
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid2X2, List, Folder, Plus, LogIn } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import { useProducts } from '@/context/ProductsContext';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { products, collections, fetchUserProducts, fetchUserCollections, isLoading, collectionsLoaded, productsLoaded } = useProducts();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  // Get tab from URL query params if available
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'collections' ? 'collections' : 'products');
  
  // Update active tab when URL changes
  useEffect(() => {
    if (tabParam === 'collections') {
      setActiveTab('collections');
    } else if (tabParam === 'products') {
      setActiveTab('products');
    }
  }, [tabParam]);
  
  // Manually trigger data fetch when needed
  const refreshData = () => {
    if (user) {
      fetchUserProducts();
      fetchUserCollections();
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };
  
  // Show login prompt if no user is authenticated
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container px-4 py-12 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome to Link-it Organize-it</h1>
            <p className="mb-8 text-gray-600">
              Please sign in to view and manage your products and collections.
            </p>
            <Button 
              onClick={handleLogin}
              className="bg-theme-purple hover:bg-theme-purple/90"
            >
              <LogIn className="h-4 w-4 mr-2" /> Sign In
            </Button>
          </div>
        </main>
        <footer className="bg-white border-t py-6">
          <div className="container px-4 text-center text-sm text-gray-500">
            <p>Link-it Organize-it. Developed with Lovable.</p>
          </div>
        </footer>
      </div>
    );
  }
  
  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container px-4 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-purple"></div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header refreshData={refreshData} />
      
      <main className="flex-grow container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewType === 'grid' ? 'bg-muted' : ''}
                  onClick={() => setViewType('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewType === 'list' ? 'bg-muted' : ''}
                  onClick={() => setViewType('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <TabsContent value="products" className="m-0">
                <Link to="/add-product">
                  <Button className="bg-theme-purple hover:bg-theme-purple/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </Link>
              </TabsContent>
              
              <TabsContent value="collections" className="m-0">
                <Link to="/add-collection">
                  <Button className="bg-theme-purple hover:bg-theme-purple/90">
                    <Folder className="mr-2 h-4 w-4" /> New Collection
                  </Button>
                </Link>
              </TabsContent>
            </div>
          </div>
          
          <TabsContent value="products" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-purple"></div>
              </div>
            ) : products.length === 0 && productsLoaded ? (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-theme-lavender rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-theme-purple" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first product to compare</p>
                <Link to="/add-product">
                  <Button className="bg-theme-purple hover:bg-theme-purple/90">
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewType === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="collections" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-purple"></div>
              </div>
            ) : collections.length === 0 && collectionsLoaded ? (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-theme-lavender rounded-full flex items-center justify-center mb-4">
                  <Folder className="h-8 w-8 text-theme-purple" />
                </div>
                <h3 className="text-lg font-medium mb-2">No collections yet</h3>
                <p className="text-gray-500 mb-6">Create collections to organize your products</p>
                <Link to="/add-collection">
                  <Button className="bg-theme-purple hover:bg-theme-purple/90">
                    Create Your First Collection
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {collections.map(collection => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container px-4 text-center text-sm text-gray-500">
          <p>Link-it Organize-it. Developed with Lovable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
