
export const translations = {
  en: {
    // Header
    'header.title': 'Retail Manager',
    'header.logout': 'Logout',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.customers': 'Customers',
    'nav.newBill': 'New Bill',
    'nav.bills': 'Bills',
    'nav.expenses': 'Expenses',
    'nav.reports': 'Reports',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.total': 'Total',
    'common.date': 'Date',
    'common.name': 'Name',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.amount': 'Amount',
    
    // Shop Settings
    'shop.name': 'Shop Name',
    'shop.language': 'Language',
    'shop.settings': 'Shop Settings',
    'shop.english': 'English',
    'shop.nepali': 'Nepali',
    
    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.noAccount': "Don't have an account? Sign Up",
    'auth.hasAccount': 'Already have an account? Sign In',
  },
  ne: {
    // Header
    'header.title': 'खुद्रा व्यवस्थापक',
    'header.logout': 'लगआउट',
    
    // Navigation
    'nav.dashboard': 'ड्यासबोर्ड',
    'nav.products': 'उत्पादनहरू',
    'nav.customers': 'ग्राहकहरू',
    'nav.newBill': 'नयाँ बिल',
    'nav.bills': 'बिलहरू',
    'nav.expenses': 'खर्चहरू',
    'nav.reports': 'रिपोर्टहरू',
    
    // Common
    'common.save': 'सेभ गर्नुहोस्',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.edit': 'सम्पादन गर्नुहोस्',
    'common.delete': 'मेटाउनुहोस्',
    'common.add': 'थप्नुहोस्',
    'common.search': 'खोज्नुहोस्',
    'common.total': 'जम्मा',
    'common.date': 'मिति',
    'common.name': 'नाम',
    'common.price': 'मूल्य',
    'common.quantity': 'परिमाण',
    'common.amount': 'रकम',
    
    // Shop Settings
    'shop.name': 'पसलको नाम',
    'shop.language': 'भाषा',
    'shop.settings': 'पसल सेटिङहरू',
    'shop.english': 'अंग्रेजी',
    'shop.nepali': 'नेपाली',
    
    // Authentication
    'auth.signIn': 'साइन इन गर्नुहोस्',
    'auth.signUp': 'साइन अप गर्नुहोस्',
    'auth.email': 'इमेल',
    'auth.password': 'पासवर्ड',
    'auth.noAccount': 'खाता छैन? साइन अप गर्नुहोस्',
    'auth.hasAccount': 'पहिले नै खाता छ? साइन इन गर्नुहोस्',
  }
};

export type TranslationKey = keyof typeof translations.en;
