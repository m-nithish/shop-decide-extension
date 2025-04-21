
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon, ArrowLeft, Trash } from 'lucide-react';
import Header from '@/components/Header';
import { useProducts } from '@/context/ProductsContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getCollection, deleteProduct } = useProducts();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const collection = product.collectionId ? getCollection(product.collectionId) : undefined;
  const formattedDate = new Date(product.dateAdded).toLocaleDateString();
  
  const handleDelete = () => {
    deleteProduct(product.id);
    navigate('/');
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
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.open(product.productUrl, '_blank')}
              >
                <LinkIcon className="h-4 w-4 mr-2" /> Visit Site
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border bg-white">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Added on {formattedDate} from {product.sourceName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-xl font-bold">{product.price}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Collection</h3>
                  {collection ? (
                    <Link to={`/collection/${collection.id}`}>
                      <Badge 
                        className="mt-1 cursor-pointer"
                        style={{ 
                          backgroundColor: `${collection.color}20`, 
                          color: collection.color 
                        }}
                      >
                        {collection.name}
                      </Badge>
                    </Link>
                  ) : (
                    <p className="text-gray-700">Not in a collection</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Source URL</h3>
                  <a 
                    href={product.productUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {product.productUrl}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
