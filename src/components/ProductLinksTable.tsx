
import React from 'react';
import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface ProductLink {
  id: string;
  source_name: string;
  product_name: string;
  url: string;
  price: number;
  rating: number;
  review_count: number;
}

interface ProductLinksTableProps {
  links: ProductLink[];
  onAddLink?: () => void;
}

const ProductLinksTable = ({ links, onAddLink }: ProductLinksTableProps) => {
  const { user } = useAuth();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Links</CardTitle>
        {user && onAddLink && (
          <Button onClick={onAddLink}>Add Link</Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>{link.source_name}</TableCell>
                <TableCell>{link.product_name}</TableCell>
                <TableCell>${link.price}</TableCell>
                <TableCell>{link.rating.toFixed(1)}/5</TableCell>
                <TableCell>{link.review_count}</TableCell>
                <TableCell>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    Visit <ExternalLink className="h-4 w-4" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {links.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No product links added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductLinksTable;
