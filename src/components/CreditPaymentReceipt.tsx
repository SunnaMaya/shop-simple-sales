import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Share2, Download, MessageCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface CreditPaymentReceiptProps {
  customerName: string;
  currentCredit: number;
  paidAmount: number;
  remainingCredit: number;
  onClose: () => void;
}

const CreditPaymentReceipt: React.FC<CreditPaymentReceiptProps> = ({ 
  customerName, 
  currentCredit, 
  paidAmount, 
  remainingCredit, 
  onClose 
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const generateReceiptText = () => {
    return `
${t('creditPayment').toUpperCase()}
================
${t('customer')}: ${customerName}
${t('date')}: ${new Date().toLocaleDateString()}
${t('time')}: ${new Date().toLocaleTimeString()}

${t('currentCredit')}: $${currentCredit.toFixed(2)}
${t('paidCredit')}: $${paidAmount.toFixed(2)}
${t('remainingCredit')}: $${remainingCredit.toFixed(2)}

================
${t('thankYou')}
    `.trim();
  };

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
            <title>${t('creditPayment')}</title>
            <style>
              body { font-family: monospace; padding: 20px; max-width: 300px; }
              .header { text-align: center; font-weight: bold; margin-bottom: 10px; }
              .separator { border-top: 1px dashed #000; margin: 10px 0; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { font-weight: bold; font-size: 1.1em; }
            </style>
          </head>
          <body>
            <div class="header">${t('creditPayment').toUpperCase()}</div>
            <div class="separator"></div>
            <div><strong>${t('customer')}:</strong> ${customerName}</div>
            <div><strong>${t('date')}:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>${t('time')}:</strong> ${new Date().toLocaleTimeString()}</div>
            <div class="separator"></div>
            <div class="item">
              <span>${t('currentCredit')}:</span>
              <span>$${currentCredit.toFixed(2)}</span>
            </div>
            <div class="item">
              <span>${t('paidCredit')}:</span>
              <span>$${paidAmount.toFixed(2)}</span>
            </div>
            <div class="item total">
              <span>${t('remainingCredit')}:</span>
              <span>$${remainingCredit.toFixed(2)}</span>
            </div>
            <div class="separator"></div>
            <div style="text-align: center; margin-top: 20px;">${t('thankYou')}</div>
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
          <CardTitle className="text-green-600">{t('creditPaymentSuccessful')}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Receipt Display */}
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <div className="text-center font-bold mb-2">{t('creditPayment').toUpperCase()}</div>
            <Separator className="my-2" />
            
            <div className="space-y-1">
              <div><strong>{t('customer')}:</strong> {customerName}</div>
              <div><strong>{t('date')}:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>{t('time')}:</strong> {new Date().toLocaleTimeString()}</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('currentCredit')}:</span>
                <span>${currentCredit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>{t('paidCredit')}:</span>
                <span>-${paidAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('remainingCredit')}:</span>
                <span>${remainingCredit.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p>{t('thankYou')}</p>
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
            {t('close')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditPaymentReceipt;