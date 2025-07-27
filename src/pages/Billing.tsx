
import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import { useBills } from '../hooks/useBills';
import { useBillingLogic } from '../hooks/useBillingLogic';
import { useDebounce } from '../hooks/useDebounce';
import { Bill } from '../types';
import Layout from '../components/Layout';
import BillReceipt from '../components/BillReceipt';
import CreditPaymentReceipt from '../components/CreditPaymentReceipt';
import ProductSearch from '../components/billing/ProductSearch';
import ProductGrid from '../components/billing/ProductGrid';
import BillItemsList from '../components/billing/BillItemsList';
import CustomerCreditInfo from '../components/billing/CustomerCreditInfo';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Receipt } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../contexts/LanguageContext';

const Billing = () => {
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading, updateCustomerSpending, updateCustomer } = useCustomers();
  const { addBill } = useBills(updateCustomerSpending);
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCreditReceipt, setShowCreditReceipt] = useState(false);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [creditReceiptData, setCreditReceiptData] = useState<{
    customerName: string;
    currentCredit: number;
    paidAmount: number;
    remainingCredit: number;
  } | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
  const { toast } = useToast();
  const { t } = useLanguage();

  // Use custom hook for billing logic
  const {
    billItems,
    selectedCustomer,
    paymentMethod,
    paidAmount,
    isCreatingBill,
    setSelectedCustomer,
    setPaymentMethod,
    setPaidAmount,
    setIsCreatingBill,
    addProductToBill,
    updateQuantity,
    removeItem,
    resetForm,
    total,
    creditAmount,
    creditReduction,
    selectedCustomerData,
  } = useBillingLogic({ products, customers, updateCustomer, addBill });

  // Debounced search for better performance
  const debouncedSearchTerm = useDebounce(productSearchTerm, 300);

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => 
    products.filter(p => 
      p.stock > 0 && 
      p.productName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [products, debouncedSearchTerm]
  );

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

    setIsCreatingBill(true);
    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      
      // Handle credit-only payment (no items)
      if (billItems.length === 0 && selectedCustomer && paidAmount > 0) {
        // This is a credit payment only
        const currentCredit = customer?.credit || 0;
        const actualPaidAmount = Math.min(paidAmount, currentCredit);
        const newCredit = Math.max(0, currentCredit - actualPaidAmount);
        
        await updateCustomer(selectedCustomer, {
          credit: newCredit
        });

        // Show credit payment receipt
        setCreditReceiptData({
          customerName: customer?.name || 'Unknown Customer',
          currentCredit: currentCredit,
          paidAmount: actualPaidAmount,
          remainingCredit: newCredit
        });
        setShowCreditReceipt(true);

        toast({
          title: t('creditPaymentSuccessful'),
          description: `${t('creditReduction')}: $${actualPaidAmount.toFixed(2)}`
        });

        // Reset form
        resetForm();
        setProductSearchTerm('');
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
      resetForm();
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
      setPaidAmount(total);
    }
  }, [total, selectedCustomer, paymentMethod, setPaidAmount]);

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
    <Layout title={t('createBill')}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('availableProducts')}</h3>
          
          <ProductSearch 
            searchTerm={productSearchTerm}
            onSearchChange={setProductSearchTerm}
          />

          {products.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No products available. Add some products first.</p>
              </CardContent>
            </Card>
          ) : (
            <ProductGrid 
              products={filteredProducts}
              onAddProduct={addProductToBill}
            />
          )}
        </div>

        {/* Bill Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{t('currentBill')}</h3>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <div>
                  <Label>{t('customerOptional')}</Label>
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
                  <Label>{t('paymentMethod')}</Label>
                  <Select value={paymentMethod} onValueChange={(value: 'Cash' | 'Credit' | 'Digital') => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">{t('cash')}</SelectItem>
                      <SelectItem value="Credit">{t('credit')}</SelectItem>
                      <SelectItem value="Digital">{t('digital')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div>
                    <Label>{t('paidAmount')}</Label>
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
              <CustomerCreditInfo customer={selectedCustomerData} />

              <BillItemsList 
                items={billItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                selectedCustomer={selectedCustomer}
              />
                  
              {billItems.length > 0 && (
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

      {/* Credit Payment Receipt Modal */}
      {showCreditReceipt && creditReceiptData && (
        <CreditPaymentReceipt 
          {...creditReceiptData}
          onClose={() => {
            setShowCreditReceipt(false);
            setCreditReceiptData(null);
          }} 
        />
      )}
    </Layout>
  );
};

export default Billing;
