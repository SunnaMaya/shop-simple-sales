import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('english')}</SelectItem>
          <SelectItem value="ne">{t('nepali')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default React.memo(LanguageSelector);