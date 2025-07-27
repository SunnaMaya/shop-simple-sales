import React, { memo } from 'react';
import { CreditCard } from 'lucide-react';
import { Customer } from '../../types';

interface CustomerCreditInfoProps {
  customer: Customer | undefined;
}

const CustomerCreditInfo: React.FC<CustomerCreditInfoProps> = memo(({ customer }) => {
  if (!customer || customer.credit <= 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-red-600" />
        <span className="font-medium text-red-800">Outstanding Credit</span>
      </div>
      <p className="text-red-600 text-sm mt-1">
        Current credit balance: ${customer.credit.toFixed(2)}
      </p>
    </div>
  );
});

CustomerCreditInfo.displayName = 'CustomerCreditInfo';

export default CustomerCreditInfo;