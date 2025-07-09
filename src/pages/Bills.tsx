
import { useBills } from '../hooks/useBills';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FileText, Calendar, User, CreditCard } from 'lucide-react';

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
          <div className="text-lg">Loading bills...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Bills">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Bills</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Bills</p>
            <p className="text-2xl font-bold text-blue-600">{bills.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {bills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Bill #{bill.id.slice(-8)}
                  </CardTitle>
                  <div className="text-right flex flex-col gap-2">
                    <p className="text-xl font-bold text-green-600">${bill.total.toFixed(2)}</p>
                    <div className="flex gap-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{bill.customerName || 'Walk-in Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{bill.date.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {bill.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.productName} x {item.qty}</span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
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
              <p className="text-gray-600 mb-4">Bills will appear here once you create them</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Bills;
