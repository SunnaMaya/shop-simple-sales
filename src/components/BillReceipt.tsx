
import React from 'react';
import { Bill } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Share2, Download, MessageCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface BillReceiptProps {
  bill: Bill;
  onClose: () => void;
}

const BillReceipt: React.FC<BillReceiptProps> = ({ bill, onClose }) => {
  const { toast } = useToast();

  const shareViaWhatsApp = () => {
    const receiptText = generateReceiptText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(receiptText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaViber = () => {
    const receiptText = generateReceiptText();
    const viberUrl = `viber://forward?text=${encodeURIComponent(receiptText)}`;
    window.open(viberUrl, '_blank');
  };

  const generateReceiptText = () => {
    const itemsList = bill.items.map(item => 
      `${item.productName} x${item.qty} - $${(item.price * item.qty).toFixed(2)}`
    ).join('\n');

    return `
RECEIPT
================
Customer: ${bill.customerName || 'Walk-in Customer'}
Date: ${bill.date.toLocaleDateString()}
Time: ${bill.date.toLocaleTimeString()}

ITEMS:
${itemsList}

================
Total: $${bill.total.toFixed(2)}
Payment: ${bill.paymentMethod}
Status: ${bill.status}

Thank you for your business!
    `.trim();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateReceiptText());
      toast({
        title: "Copied!",
        description: "Receipt copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy receipt",
        variant: "destructive"
      });
    }
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; padding: 20px; max-width: 300px; }
              .header { text-align: center; font-weight: bold; margin-bottom: 10px; }
              .separator { border-top: 1px dashed #000; margin: 10px 0; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { font-weight: bold; font-size: 1.1em; }
            </style>
          </head>
          <body>
            <div class="header">RECEIPT</div>
            <div class="separator"></div>
            <div><strong>Customer:</strong> ${bill.customerName || 'Walk-in Customer'}</div>
            <div><strong>Date:</strong> ${bill.date.toLocaleDateString()}</div>
            <div><strong>Time:</strong> ${bill.date.toLocaleTimeString()}</div>
            <div class="separator"></div>
            <div><strong>ITEMS:</strong></div>
            ${bill.items.map(item => `
              <div class="item">
                <span>${item.productName} x${item.qty}</span>
                <span>$${(item.price * item.qty).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="separator"></div>
            <div class="item total">
              <span>TOTAL:</span>
              <span>$${bill.total.toFixed(2)}</span>
            </div>
            <div><strong>Payment:</strong> ${bill.paymentMethod}</div>
            <div><strong>Status:</strong> ${bill.status}</div>
            <div class="separator"></div>
            <div style="text-align: center; margin-top: 20px;">Thank you for your business!</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Bill Created Successfully!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Receipt Display */}
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <div className="text-center font-bold mb-2">RECEIPT</div>
            <Separator className="my-2" />
            
            <div className="space-y-1">
              <div><strong>Customer:</strong> {bill.customerName || 'Walk-in Customer'}</div>
              <div><strong>Date:</strong> {bill.date.toLocaleDateString()}</div>
              <div><strong>Time:</strong> {bill.date.toLocaleTimeString()}</div>
            </div>
            
            <Separator className="my-2" />
            <div className="font-bold">ITEMS:</div>
            
            {bill.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.productName} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL:</span>
              <span>${bill.total.toFixed(2)}</span>
            </div>
            
            <div className="mt-2 space-y-1">
              <div><strong>Payment:</strong> {bill.paymentMethod}</div>
              <div><strong>Status:</strong> {bill.status}</div>
            </div>
            
            <div className="text-center mt-4">
              <p>Thank you for your business!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={shareViaWhatsApp} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button onClick={shareViaViber} className="bg-purple-600 hover:bg-purple-700">
              <Share2 className="h-4 w-4 mr-2" />
              Viber
            </Button>
            
            <Button onClick={copyToClipboard} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Copy
            </Button>
            
            <Button onClick={printReceipt} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <Button onClick={onClose} className="w-full" variant="secondary">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillReceipt;
