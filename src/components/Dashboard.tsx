
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
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Retail Manager</h2>
          <p className="text-gray-600">Manage your shop efficiently</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.link} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`${item.color} p-3 rounded-lg text-white`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
