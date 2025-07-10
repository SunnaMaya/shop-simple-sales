
import { useBills } from '../hooks/useBills';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FileText, Calendar, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Bills = () => {
  const { bills, loading } = useBills();

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Cash':
        return 'bg-green-100 text-green-800';
      case 'Credit':
        return 'bg-red-100 text-red-800';
      case 'Digital':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout title="Bills">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="ml-3 text-lg">Loading bills...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Bills">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Bills</h2>
            <p className="text-gray-600 mt-1">Manage and track your sales</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-blue-600">{bills.length}</p>
            </div>
            <Link to="/billing">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Bill
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {bills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <span className="truncate">Bill #{bill.id.slice(-8)}</span>
                  </CardTitle>
                  <div className="flex flex-col sm:items-end gap-2">
                    <p className="text-xl font-bold text-green-600">${bill.total.toFixed(2)}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getPaymentMethodColor(bill.paymentMethod)}>
                        {bill.paymentMethod}
                      </Badge>
                      {bill.status && (
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{bill.customerName || 'Walk-in Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{bill.date.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Items ({bill.items.length}):</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {bill.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="truncate mr-2">{item.productName} x {item.qty}</span>
                        <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bills.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
              <p className="text-gray-600 mb-4">Create your first bill to get started</p>
              <Link to="/billing">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bill
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Bills;
