export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    products: "Products",
    customers: "Customers",
    billing: "Billing",
    bills: "Bills",
    expenses: "Expenses",
    reports: "Reports",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    loading: "Loading...",
    search: "Search",
    total: "Total",
    date: "Date",
    time: "Time",
    status: "Status",
    
    // Billing
    createBill: "Create Bill",
    availableProducts: "Available Products",
    currentBill: "Current Bill",
    customer: "Customer",
    customerOptional: "Customer (Optional)",
    paymentMethod: "Payment Method",
    paidAmount: "Paid Amount",
    billCreatedSuccessfully: "Bill Created Successfully!",
    receipt: "RECEIPT",
    items: "ITEMS",
    payment: "Payment",
    thankYou: "Thank you for your business!",
    
    // Credit Payment
    creditPayment: "Credit Payment",
    currentCredit: "Current Credit",
    paidCredit: "Paid Credit",
    remainingCredit: "Remaining Credit",
    creditReduction: "Credit Reduction",
    outstandingCredit: "Outstanding Credit",
    creditPaymentSuccessful: "Credit payment successful!",
    
    // Payment Methods
    cash: "Cash",
    credit: "Credit",
    digital: "Digital",
    
    // Status
    paid: "Paid",
    unpaid: "Unpaid",
    partial: "Partial",
    
    // Messages
    noItemsAdded: "No items added yet",
    canMakeCreditPayment: "You can still make a credit payment without items",
    productOutOfStock: "Product out of stock",
    notEnoughStock: "Not enough stock available",
    
    // Language
    language: "Language",
    english: "English",
    nepali: "नेपाली"
  },
  
  ne: {
    // Navigation
    dashboard: "ड्यासबोर्ड",
    products: "उत्पादनहरू",
    customers: "ग्राहकहरू",
    billing: "बिलिङ",
    bills: "बिलहरू",
    expenses: "खर्चहरू",
    reports: "रिपोर्टहरू",
    
    // Common
    save: "सेभ गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    delete: "मेटाउनुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    close: "बन्द गर्नुहोस्",
    loading: "लोड हुँदै...",
    search: "खोज्नुहोस्",
    total: "जम्मा",
    date: "मिति",
    time: "समय",
    status: "स्थिति",
    
    // Billing
    createBill: "बिल बनाउनुहोस्",
    availableProducts: "उपलब्ध उत्पादनहरू",
    currentBill: "हालको बिल",
    customer: "ग्राहक",
    customerOptional: "ग्राहक (वैकल्पिक)",
    paymentMethod: "भुक्तानी विधि",
    paidAmount: "भुक्तान गरिएको रकम",
    billCreatedSuccessfully: "बिल सफलतापूर्वक बनाइयो!",
    receipt: "रसिद",
    items: "वस्तुहरू",
    payment: "भुक्तानी",
    thankYou: "तपाईंको व्यापारको लागि धन्यवाद!",
    
    // Credit Payment
    creditPayment: "क्रेडिट भुक्तानी",
    currentCredit: "हालको क्रेडिट",
    paidCredit: "भुक्तान गरिएको क्रेडिट",
    remainingCredit: "बाँकी क्रेडिट",
    creditReduction: "क्रेडिट कमी",
    outstandingCredit: "बकाया क्रेडिट",
    creditPaymentSuccessful: "क्रेडिट भुक्तानी सफल!",
    
    // Payment Methods
    cash: "नगद",
    credit: "क्रेडिट",
    digital: "डिजिटल",
    
    // Status
    paid: "भुक्तान गरिएको",
    unpaid: "भुक्तान नगरिएको",
    partial: "आंशिक",
    
    // Messages
    noItemsAdded: "कुनै वस्तु थपिएको छैन",
    canMakeCreditPayment: "तपाईं अझै पनि वस्तुहरू बिना क्रेडिट भुक्तानी गर्न सक्नुहुन्छ",
    productOutOfStock: "उत्पादन स्टकमा छैन",
    notEnoughStock: "पर्याप्त स्टक उपलब्ध छैन",
    
    // Language
    language: "भाषा",
    english: "English",
    nepali: "नेपाली"
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;