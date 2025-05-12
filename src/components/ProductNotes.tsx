
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SaveProductNotesParams } from "@/types/supabase";
import { callRPC } from '@/utils/supabaseHelpers';

interface ProductNotesProps {
  productId: string;
  initialNotes?: string;
}

const ProductNotes = ({ productId, initialNotes = '' }: ProductNotesProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveNotes = async () => {
    if (!user) return;

    try {
      const params: SaveProductNotesParams = {
        p_product_id: productId,
        p_content: notes
      };
      
      const { error } = await callRPC<null, SaveProductNotesParams>('save_product_notes', params);

      if (error) throw error;

      toast({
        title: "Notes saved",
        description: "Your notes have been saved successfully."
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notes. Please try again."
      });
      console.error("Error saving notes:", error);
    }
  };

  const showEmptyState = !notes && !isEditing;

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes about this product (size, color, where you'll use it, etc.)"
            className="min-h-[150px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveNotes}>Save Notes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {showEmptyState ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">
                No notes yet. Click the button below to add your notes about this product.
              </p>
              {user && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
              </div>
              {user && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Notes
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductNotes;
