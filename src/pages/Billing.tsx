
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import { useBills } from '../hooks/useBills';
import { BillItem } from '../types';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, Minus, ShoppingCart, Trash2, Receipt } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Billing = () => {
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();
  const { addBill } = useBills();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit' | 'Digital'>('Cash');
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const { toast } = useToast();

  const addProductToBill = (product: any) => {
    const existingItem = billItems.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.qty < product.stock) {
        setBillItems(billItems.map(item =>
          item.productId === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        ));
      } else {
        toast({
          title: "Error",
          description: "Not enough stock available",
          variant: "destructive"
        });
      }
    } else {
      if (product.stock > 0) {
        setBillItems([...billItems, {
          productId: product.id,
          productName: product.productName,
          qty: 1,
          price: product.retailPrice
        }]);
      } else {
        toast({
          title: "Error",
          description: "Product out of stock",
          variant: "destructive"
        });
      }
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setBillItems(billItems.map(item => {
      if (item.productId === productId) {
        const newQty = item.qty + change;
        if (newQty <= 0) {
          return null;
        }
        if (newQty > product.stock) {
          toast({
            title: "Error",
            description: "Not enough stock available",
            variant: "destructive"
          });
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean) as BillItem[]);
  };

  const removeItem = (productId: string) => {
    setBillItems(billItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const createBill = async () => {
    if (billItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the bill",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingBill(true);
    try {
      const total = calculateTotal();
      const customer = customers.find(c => c.id === selectedCustomer);
      
      const billData = {
        customerId: selectedCustomer || undefined,
        customerName: customer?.name || 'Walk-in Customer',
        date: new Date(),
        items: billItems,
        total,
        paymentMethod,
        status: 'paid' as const
      };

      await addBill(billData);

      toast({
        title: "Success",
        description: "Bill created successfully!"
      });

      // Reset form
      setBillItems([]);
      setSelectedCustomer('');
      setPaymentMethod('Cash');
    } catch (error) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBill(false);
    }
  };

  if (productsLoading || customersLoading) {
    return (
      <Layout title="Create Bill">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="ml-3 text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create Bill">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Products</h3>
          {products.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No products available. Add some products first.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {products.filter(p => p.stock > 0).map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addProductToBill(product)}>
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
          )}
        </div>

        {/* Bill Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Current Bill</h3>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <div>
                  <Label>Customer (Optional)</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer or leave empty for walk-in" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value: 'Cash' | 'Credit' | 'Digital') => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {billItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No items added yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {billItems.map((item) => (
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
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.qty}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={() => removeItem(item.productId)}
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
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={createBill} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isCreatingBill}
                  >
                    {isCreatingBill ? 'Creating...' : 'Create Bill'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Billing;
