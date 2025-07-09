
export interface Product {
  id: string;
  productName: string;
  purchasePrice: number;
  retailPrice: number;
  stock: number;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  credit: number;
  createdAt: Date;
}

export interface BillItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
}

export interface Bill {
  id: string;
  customerId?: string;
  customerName?: string;
  date: Date;
  items: BillItem[];
  total: number;
  paymentMethod: 'Cash' | 'Credit' | 'Digital';
  createdAt: Date;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  createdAt: Date;
}
