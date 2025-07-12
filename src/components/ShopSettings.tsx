
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Settings } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../hooks/use-toast';
import { translations } from '../lib/translations';

interface ShopSettingsProps {
  currentLanguage: 'en' | 'ne';
}

const ShopSettings = ({ currentLanguage }: ShopSettingsProps) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [shopName, setShopName] = useState(profile?.shop_name || '');
  const [language, setLanguage] = useState<'en' | 'ne'>(profile?.preferred_language || 'en');
  const [saving, setSaving] = useState(false);

  const t = (key: keyof typeof translations.en) => translations[currentLanguage][key];

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      await updateProfile({
        shop_name: shopName,
        preferred_language: language
      });
      
      toast({
        title: "Success",
        description: "Shop settings updated successfully!"
      });
      
      setOpen(false);
      
      // Reload page if language changed to update all translations
      if (language !== profile.preferred_language) {
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shop settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title={t('shop.settings')}>
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('shop.settings')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-name">{t('shop.name')}</Label>
            <Input
              id="shop-name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('shop.language')}</Label>
            <Select value={language} onValueChange={(value: 'en' | 'ne') => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('shop.english')}</SelectItem>
                <SelectItem value="ne">{t('shop.nepali')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopSettings;
