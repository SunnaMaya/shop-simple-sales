
import { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Plus, User, Phone, MapPin, CreditCard, ShoppingBag, Hash, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Customer } from '../types';

const Customers = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    credit: '0'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      credit: '0'
    });
    setEditingCustomer(null);
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address || '',
        credit: customer.credit.toString()
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in name and phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address || undefined,
          credit: parseFloat(formData.credit) || 0
        });
        toast({
          title: "Success",
          description: "Customer updated successfully!"
        });
      } else {
        await addCustomer({
          name: formData.name,
          phone: formData.phone,
          address: formData.address || undefined,
          credit: parseFloat(formData.credit) || 0
        });
        toast({
          title: "Success",
          description: "Customer added successfully!"
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (customerId: string, customerName: string) => {
    try {
      await deleteCustomer(customerId);
      toast({
        title: "Success",
        description: `${customerName} deleted successfully!`
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive"
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Layout title="Customers">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading customers...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Customers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit">Credit Balance</Label>
                  <Input
                    id="credit"
                    type="number"
                    step="0.01"
                    value={formData.credit}
                    onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers by name, phone, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    {customer.name}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(customer)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{customer.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(customer.id, customer.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Total Spent</span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      ${customer.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Hash className="h-4 w-4 text-purple-600" />
                      <span className="text-xs text-gray-600">Total Bills</span>
                    </div>
                    <p className="text-sm font-bold text-purple-600">
                      {customer.totalBills}
                    </p>
                  </div>
                </div>

                {customer.credit > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-gray-600">Credit Balance:</span>
                    </div>
                    <Badge variant="destructive">
                      ${customer.credit.toFixed(2)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && customers.length > 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}

        {customers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first customer</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Customers;
