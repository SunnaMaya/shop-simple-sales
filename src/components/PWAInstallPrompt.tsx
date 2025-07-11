
import { useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-sm">Install App</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Install Shop Sales app for quick access and offline use.
        </p>
        <div className="flex gap-2">
          <Button
            onClick={installApp}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 flex-1"
          >
            Install
          </Button>
          <Button
            onClick={() => setDismissed(true)}
            variant="outline"
            size="sm"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;
