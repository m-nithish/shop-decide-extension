
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out"
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-theme-purple/20 flex items-center justify-center">
            <span className="text-theme-purple font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Link-it</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/add-product">
                <Button className="bg-theme-purple hover:bg-theme-purple/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-theme-purple hover:bg-theme-purple/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
