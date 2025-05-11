
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign out failed',
          description: error.message,
        });
      } else {
        toast({
          title: 'Signed out',
          description: 'You have been signed out successfully.',
        });
        navigate('/auth');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: 'An unexpected error occurred.',
      });
    }
  };
  
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-semibold text-lg text-theme-purple flex items-center">
          <span className="bg-theme-purple text-white px-2 py-1 rounded-md mr-2">L</span>
          Link-it Organize-it
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCircle className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
