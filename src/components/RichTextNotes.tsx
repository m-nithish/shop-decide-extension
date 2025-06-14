
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Edit, Plus, Bold, Italic, List, ListOrdered, Heading2, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SaveProductNotesParams } from "@/types/supabase";
import { callRPC } from '@/utils/supabaseHelpers';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextNotesProps {
  productId: string;
  initialNotes?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1 mb-3 border-b pb-2 flex-wrap">
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
};

const RichTextNotes = ({ productId, initialNotes = '' }: RichTextNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          keepMarks: true,
          keepAttributes: false,
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      BulletList.configure({
        HTMLAttributes: {
          class: 'my-custom-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'my-custom-ordered-list',
        },
      }),
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: 'Add your color preference, size requirements, or other criteria...',
      }),
    ],
    content: initialNotes,
    editable: isEditing,
  });
  
  // Update editor content when initialNotes changes
  useEffect(() => {
    if (editor && !isEditing) {
      editor.commands.setContent(initialNotes);
    }
  }, [initialNotes, editor, isEditing]);

  // Update editor editable state when isEditing changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  const handleSaveNotes = async () => {
    if (!user || !editor) return;

    try {
      const htmlContent = editor.getHTML();
      
      const params: SaveProductNotesParams = {
        p_product_id: productId,
        p_content: htmlContent
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

  const hasContent = editor?.isEmpty !== undefined && !editor?.isEmpty;
  const showEmptyState = !hasContent && !isEditing;

  return (
    <div className="space-y-4">
      {isEditing ? (
        <div className="space-y-2 border rounded-md p-3 bg-white shadow-sm">
          <MenuBar editor={editor} />
          <EditorContent 
            editor={editor}
            className="min-h-[200px] prose max-w-none prose-sm prose-stone focus:outline-none border border-gray-200 rounded-md p-4 shadow-inner prose-headings:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
          />
          <div className="flex gap-2 mt-3 pt-2 border-t">
            <Button onClick={handleSaveNotes} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Notes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          {showEmptyState ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">
                No notes yet. Click the button below to add notes about size, color, or where you'll use this product.
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
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                {editor && (
                  <div 
                    className="prose prose-sm max-w-none prose-stone prose-headings:text-gray-800 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                  />
                )}
              </div>
              {user && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center mt-2"
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

export default RichTextNotes;
