import { useState, useCallback, useMemo } from 'react';
import { BillItem, Product, Customer, Bill } from '../types';
import { useToast } from './use-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface UseBillingLogicProps {
  products: Product[];
  customers: Customer[];
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<void>;
  addBill: (billData: Omit<Bill, 'id' | 'createdAt'>) => Promise<Bill>;
}

export const useBillingLogic = ({ 
  products, 
  customers, 
  updateCustomer, 
  addBill 
}: UseBillingLogicProps) => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit' | 'Digital'>('Cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const addProductToBill = useCallback((product: Product) => {
    setBillItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        if (existingItem.qty < product.stock) {
          return prev.map(item =>
            item.productId === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          );
        } else {
          toast({
            title: "Error",
            description: "Not enough stock available",
            variant: "destructive"
          });
          return prev;
        }
      } else {
        if (product.stock > 0) {
          return [...prev, {
            productId: product.id,
            productName: product.productName,
            qty: 1,
            price: product.retailPrice
          }];
        } else {
          toast({
            title: "Error",
            description: "Product out of stock",
            variant: "destructive"
          });
          return prev;
        }
      }
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setBillItems(prev => prev.map(item => {
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
  }, [products, toast]);

  const removeItem = useCallback((productId: string) => {
    setBillItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const resetForm = useCallback(() => {
    setBillItems([]);
    setSelectedCustomer('');
    setPaymentMethod('Cash');
    setPaidAmount(0);
  }, []);

  // Memoized calculations
  const total = useMemo(() => 
    billItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
    [billItems]
  );

  const creditAmount = useMemo(() => 
    Math.max(0, total - paidAmount),
    [total, paidAmount]
  );

  const creditReduction = useMemo(() => 
    Math.max(0, paidAmount - total),
    [total, paidAmount]
  );

  const selectedCustomerData = useMemo(() => 
    customers.find(c => c.id === selectedCustomer),
    [customers, selectedCustomer]
  );

  return {
    // State
    billItems,
    selectedCustomer,
    paymentMethod,
    paidAmount,
    isCreatingBill,
    
    // Setters
    setSelectedCustomer,
    setPaymentMethod,
    setPaidAmount,
    setIsCreatingBill,
    
    // Actions
    addProductToBill,
    updateQuantity,
    removeItem,
    resetForm,
    
    // Computed values
    total,
    creditAmount,
    creditReduction,
    selectedCustomerData,
  };
};