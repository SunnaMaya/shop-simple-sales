import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = memo(({ searchTerm, onSearchChange }) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={t('search') + ' products...'}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
});

ProductSearch.displayName = 'ProductSearch';

export default ProductSearch;