
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Package, Users, FileText, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import { useBills } from '../hooks/useBills';
import Layout from './Layout';

const Dashboard = () => {
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();
  const { bills, loading: billsLoading } = useBills();

  const menuItems = [
    {
      title: 'Products',
      description: 'Manage inventory',
      icon: Package,
      link: '/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Customers',
      description: 'Customer database',
      icon: Users,
      link: '/customers',
      color: 'bg-green-500'
    },
    {
      title: 'New Bill',
      description: 'Create invoice',
      icon: Plus,
      link: '/billing',
      color: 'bg-purple-500'
    },
    {
      title: 'Bills',
      description: 'View all bills',
      icon: FileText,
      link: '/bills',
      color: 'bg-orange-500'
    },
    {
      title: 'Expenses',
      description: 'Track expenses',
      icon: DollarSign,
      link: '/expenses',
      color: 'bg-red-500'
    },
    {
      title: 'Reports',
      description: 'Sales analytics',
      icon: TrendingUp,
      link: '/reports',
      color: 'bg-indigo-500'
    }
  ];

  // Calculate totals
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Retail Manager</h2>
          <p className="text-lg text-gray-600">Manage your shop efficiently</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.link} className="block group">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md group-hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`${item.color} p-4 rounded-xl text-white shadow-lg`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">
                {productsLoading ? '...' : products.length}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
              {lowStockProducts > 0 && (
                <div className="text-xs text-red-600 mt-1">
                  {lowStockProducts} low stock
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">
                {customersLoading ? '...' : customers.length}
              </div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">
                {billsLoading ? '...' : bills.length}
              </div>
              <div className="text-sm text-gray-600">Total Bills</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">
                {billsLoading ? '...' : `$${totalRevenue.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {!billsLoading && bills.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Bills</h3>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {bills.slice(0, 5).map((bill) => (
                <div key={bill.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{bill.customerName || 'Walk-in Customer'}</p>
                    <p className="text-sm text-gray-600">{bill.date.toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${bill.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{bill.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
