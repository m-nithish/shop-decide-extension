
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { SaveProductNotesParams, SaveProductNotesResponse } from "@/types/supabase";

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
        p_user_id: user.id,
        p_content: notes
      };
      
      // Add explicit type assertion to specify the expected return type
      const { error } = await supabase.rpc('save_product_notes', params) as unknown as SaveProductNotesResponse;

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this product..."
              className="min-h-[150px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveNotes}>Save Notes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {notes || "No notes yet. Click edit to add your notes about this product."}
            </p>
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Notes</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductNotes;
