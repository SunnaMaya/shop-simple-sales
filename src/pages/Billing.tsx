
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import { useBills } from '../hooks/useBills';
import { BillItem, Bill } from '../types';
import Layout from '../components/Layout';
import BillReceipt from '../components/BillReceipt';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, Minus, ShoppingCart, Trash2, Receipt, Search, CreditCard } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Billing = () => {
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading, updateCustomerSpending, updateCustomer } = useCustomers();
  const { addBill } = useBills(updateCustomerSpending);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit' | 'Digital'>('Cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
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

  const calculateCredit = () => {
    const total = calculateTotal();
    return Math.max(0, total - paidAmount);
  };

  const calculateCreditReduction = () => {
    const total = calculateTotal();
    return Math.max(0, paidAmount - total);
  };

  const createBill = async () => {
    // Allow bill creation even without items if customer is selected and making a payment
    if (billItems.length === 0 && !selectedCustomer) {
      toast({
        title: "Error",
        description: "Please add items to the bill or select a customer to make a credit payment",
        variant: "destructive"
      });
      return;
    }

    if (paidAmount < 0) {
      toast({
        title: "Error",
        description: "Paid amount cannot be negative",
        variant: "destructive"
      });
      return;
    }

    const total = calculateTotal();
    const creditAmount = calculateCredit();
    const creditReduction = calculateCreditReduction();

    setIsCreatingBill(true);
    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      
      // Handle credit-only payment (no items)
      if (billItems.length === 0 && selectedCustomer && paidAmount > 0) {
        // This is a credit payment only
        const currentCredit = customer?.credit || 0;
        const newCredit = Math.max(0, currentCredit - paidAmount);
        
        await updateCustomer(selectedCustomer, {
          credit: newCredit
        });

        toast({
          title: "Success",
          description: `Credit payment successful! Credit reduced by $${paidAmount.toFixed(2)}`
        });

        // Reset form
        setSelectedCustomer('');
        setPaymentMethod('Cash');
        setPaidAmount(0);
        setIsCreatingBill(false);
        return;
      }

      // Regular bill creation with items
      const billData = {
        customerId: selectedCustomer || undefined,
        customerName: customer?.name || 'Walk-in Customer',
        date: new Date(),
        items: billItems,
        total,
        paymentMethod,
        status: creditAmount > 0 ? 'partial' as const : 'paid' as const
      };

      console.log('Creating bill with data:', billData);
      const createdBill = await addBill(billData);
      console.log('Bill created successfully:', createdBill);

      // Handle customer credit adjustments
      if (selectedCustomer && customer) {
        const currentCredit = customer.credit || 0;
        let newCredit = currentCredit;

        if (creditAmount > 0) {
          // Customer owes money, add to credit
          newCredit = currentCredit + creditAmount;
        } else if (creditReduction > 0) {
          // Customer paid more than bill, reduce credit
          newCredit = Math.max(0, currentCredit - creditReduction);
        }

        if (newCredit !== currentCredit) {
          await updateCustomer(selectedCustomer, {
            credit: newCredit
          });
        }
      }

      let successMessage = 'Bill created successfully!';
      if (creditAmount > 0) {
        successMessage += ` Credit amount: $${creditAmount.toFixed(2)}`;
      } else if (creditReduction > 0) {
        successMessage += ` Credit reduced by: $${creditReduction.toFixed(2)}`;
      }

      toast({
        title: "Success",
        description: successMessage
      });

      // Show receipt
      setCurrentBill(createdBill);
      setShowReceipt(true);

      // Reset form
      setBillItems([]);
      setSelectedCustomer('');
      setPaymentMethod('Cash');
      setPaidAmount(0);
      setProductSearchTerm('');
    } catch (error) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create bill",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBill(false);
    }
  };

  // Auto-set paid amount to total when no customer is selected or payment method changes
  useEffect(() => {
    if (!selectedCustomer || paymentMethod === 'Cash') {
      setPaidAmount(calculateTotal());
    }
  }, [billItems, selectedCustomer, paymentMethod]);

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

  const total = calculateTotal();
  const creditAmount = calculateCredit();
  const creditReduction = calculateCreditReduction();
  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  const filteredProducts = products.filter(p => 
    p.stock > 0 && p.productName.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <Layout title="Create Bill">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Products</h3>
          
          {/* Product Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {products.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No products available. Add some products first.</p>
              </CardContent>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No products found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
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
                          {customer.credit > 0 && (
                            <span className="text-xs text-red-600 ml-2">
                              (Credit: ${customer.credit.toFixed(2)})
                            </span>
                          )}
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

                {selectedCustomer && (
                  <div>
                    <Label>Paid Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      placeholder="Enter amount paid"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Customer Credit Info */}
              {selectedCustomerData && selectedCustomerData.credit > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">Outstanding Credit</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    Current credit balance: ${selectedCustomerData.credit.toFixed(2)}
                  </p>
                </div>
              )}

              {billItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No items added yet</p>
                  {selectedCustomer && (
                    <p className="text-sm mt-2 text-blue-600">
                      You can still make a credit payment without items
                    </p>
                  )}
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
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                    
                    {selectedCustomer && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span>Paid:</span>
                          <span className="text-blue-600">${paidAmount.toFixed(2)}</span>
                        </div>
                        {creditAmount > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span>Credit:</span>
                            <span className="text-red-600">${creditAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {creditReduction > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span>Credit Reduction:</span>
                            <span className="text-green-600">-${creditReduction.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
              
              <Button 
                onClick={createBill} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isCreatingBill}
              >
                {isCreatingBill ? 'Processing...' : 
                 billItems.length === 0 && selectedCustomer ? 'Make Credit Payment' : 'Create Bill'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && currentBill && (
        <BillReceipt 
          bill={currentBill} 
          onClose={() => {
            setShowReceipt(false);
            setCurrentBill(null);
          }} 
        />
      )}
    </Layout>
  );
};

export default Billing;
