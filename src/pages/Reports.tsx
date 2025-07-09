
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bill, Expense } from '../types';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, FileText, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Reports = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch bills
      const billsSnapshot = await getDocs(collection(db, 'bills'));
      const billsData = billsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Bill[];
      setBills(billsData);

      // Fetch expenses
      const expensesSnapshot = await getDocs(collection(db, 'expenses'));
      const expensesData = expensesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Expense[];
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch report data",
        variant: "destructive"
      });
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    return { startDate, endDate: now };
  };

  const filterByPeriod = <T extends { date: Date }>(items: T[]): T[] => {
    const { startDate, endDate } = getDateRange();
    return items.filter(item => item.date >= startDate && item.date <= endDate);
  };

  const getTotalSales = () => {
    const filteredBills = filterByPeriod(bills);
    return filteredBills.reduce((total, bill) => total + bill.total, 0);
  };

  const getTotalExpenses = () => {
    const filteredExpenses = filterByPeriod(expenses);
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getProfit = () => {
    return getTotalSales() - getTotalExpenses();
  };

  const getSalesCount = () => {
    return filterByPeriod(bills).length;
  };

  const getTopPaymentMethod = () => {
    const filteredBills = filterByPeriod(bills);
    const paymentMethods = filteredBills.reduce((acc, bill) => {
      acc[bill.paymentMethod] = (acc[bill.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMethod = Object.entries(paymentMethods).sort(([,a], [,b]) => b - a)[0];
    return topMethod ? topMethod[0] : 'N/A';
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return 'Today';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      default:
        return 'Period';
    }
  };

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Sales Reports</h2>
          <Select value={period} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setPeriod(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${getTotalSales().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${getTotalExpenses().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${getProfit().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{getSalesCount()}</div>
              <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Most Popular:</span>
                  <span className="font-medium">{getTopPaymentMethod()}</span>
                </div>
                {['Cash', 'Credit', 'Digital'].map(method => {
                  const count = filterByPeriod(bills).filter(bill => bill.paymentMethod === method).length;
                  const percentage = getSalesCount() > 0 ? (count / getSalesCount() * 100).toFixed(1) : '0';
                  return (
                    <div key={method} className="flex justify-between items-center">
                      <span className="text-sm">{method}:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Average Sale:</span>
                  <span className="font-medium">
                    ${getSalesCount() > 0 ? (getTotalSales() / getSalesCount()).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Largest Sale:</span>
                  <span className="font-medium">
                    ${filterByPeriod(bills).length > 0 ? Math.max(...filterByPeriod(bills).map(b => b.total)).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Items Sold:</span>
                  <span className="font-medium">
                    {filterByPeriod(bills).reduce((total, bill) => 
                      total + bill.items.reduce((sum, item) => sum + item.qty, 0), 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="font-medium">{getPeriodLabel()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {bills.length === 0 && expenses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
              <p className="text-gray-600 mb-4">Reports will appear here once you have sales and expenses</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
