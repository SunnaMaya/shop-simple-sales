import React, { memo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = memo(({ products, onAddProduct }) => {
  if (products.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No products found matching your search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onAddProduct(product)}
        >
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">{product.productName}</h4>
              <Badge variant="secondary" className="text-xs">
                Stock: {product.stock}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">
                ${product.retailPrice.toFixed(2)}
              </span>
              <Button size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;