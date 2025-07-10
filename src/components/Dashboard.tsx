
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Package, Users, FileText, DollarSign, TrendingUp, Plus } from 'lucide-react';
import Layout from './Layout';

const Dashboard = () => {
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
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">Total Bills</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">$0</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
