import React, { memo } from 'react';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { BillItem } from '../../types';

interface BillItemsListProps {
  items: BillItem[];
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  selectedCustomer?: string;
}

const BillItemsList: React.FC<BillItemsListProps> = memo(({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  selectedCustomer 
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No items added yet</p>
        {selectedCustomer && (
          <p className="text-sm mt-2 text-blue-600">
            You can still make a credit payment without items
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {items.map((item) => (
        <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex-1">
            <p className="font-medium text-sm">{item.productName}</p>
            <p className="text-xs text-gray-600">${item.price.toFixed(2)} each</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => onUpdateQuantity(item.productId, -1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{item.qty}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => onUpdateQuantity(item.productId, 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={() => onRemoveItem(item.productId)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-sm font-medium ml-2 w-16 text-right">
            ${(item.price * item.qty).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
});

BillItemsList.displayName = 'BillItemsList';

export default BillItemsList;