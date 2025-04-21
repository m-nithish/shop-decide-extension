
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductsProvider } from "./context/ProductsContext";
import Index from "./pages/Index";
import AddProduct from "./pages/AddProduct";
import AddCollection from "./pages/AddCollection";
import ProductDetail from "./pages/ProductDetail";
import CollectionDetail from "./pages/CollectionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-collection" element={<AddCollection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/collection/:id" element={<CollectionDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProductsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
