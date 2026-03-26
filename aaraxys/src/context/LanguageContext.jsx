import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  'en': {
    // Sidebar & Navigation
    dashboard: 'Dashboard',
    markets: 'Markets',
    terminal: 'Terminal',
    portfolio: 'Portfolio',
    orders: 'Orders',
    funds: 'Funds',
    more: 'More',
    profile: 'Profile',

    // Navbar
    searchPlaceholder: 'Search stocks, ETF, Indices...',
    noResults: 'No results found for',
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNewNotifications: 'No new notifications',
    viewAllActivity: 'View All Activity',

    // Profile Page
    account: 'Account',
    accountSubtitle: 'Manage your personal information and preferences.',
    personalInfo: 'Personal Info',
    passwordSecurity: 'Password & Security',
    bankDetails: 'Bank Details',
    preferences: 'Preferences',
    signOut: 'Sign Out',
    editProfile: 'Edit Profile',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    contactInformation: 'Contact Information',
    emailAddress: 'Email Address',
    emailCannotChange: 'Email cannot be changed.',
    notProvided: 'Not provided',
    phoneNumber: 'Phone Number',
    notAddedYet: 'Not added yet',
    addressDetails: 'Address details',
    residentialAddress: 'Residential Address',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorDesc: 'Add an extra layer of security to your account by requiring a verification code when you sign in.',
    paymentMethods: 'Payment Methods',
    addNew: '+ Add New',
    primary: 'Primary',
    cardholderName: 'Cardholder Name',
    addNewCard: 'Add new card',
    noTransactionsYet: 'No transactions yet',
    billingHistory: 'Billing History',
    recentPayments: 'Your recent payments will appear here.',
    notificationsTitle: 'Notifications',
    securityAlerts: 'Security Alerts',
    securityAlertsDesc: 'Get notified about new logins and security updates',
    marketingEmails: 'Marketing Emails',
    marketingEmailsDesc: 'Receive news about new features and updates',
    activityDigest: 'Activity Digest',
    activityDigestDesc: 'Weekly summary of your account activity',
    display: 'Display',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    system: 'System',
    language: 'Language',
    addNewCardTitle: 'Add New Card',
    cardType: 'Card Type',
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    addCard: 'Add Card',
    joined: 'Joined',
  },
  'hi': {
    // Sidebar & Navigation
    dashboard: 'डैशबोर्ड',
    markets: 'बाज़ार',
    terminal: 'टर्मिनल',
    portfolio: 'पोर्टफोलियो',
    orders: 'ऑर्डर',
    funds: 'फंड',
    more: 'और',
    profile: 'प्रोफ़ाइल',

    // Navbar
    searchPlaceholder: 'स्टॉक, ETF, इंडेक्स खोजें...',
    noResults: 'कोई परिणाम नहीं मिला',
    notifications: 'सूचनाएँ',
    markAllRead: 'सभी पढ़ा गया',
    noNewNotifications: 'कोई नई सूचना नहीं',
    viewAllActivity: 'सभी गतिविधि देखें',

    // Profile Page
    account: 'खाता',
    accountSubtitle: 'अपनी व्यक्तिगत जानकारी और प्राथमिकताएँ प्रबंधित करें।',
    personalInfo: 'व्यक्तिगत जानकारी',
    passwordSecurity: 'पासवर्ड और सुरक्षा',
    bankDetails: 'बैंक विवरण',
    preferences: 'प्राथमिकताएँ',
    signOut: 'साइन आउट',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    cancel: 'रद्द करें',
    saveChanges: 'बदलाव सहेजें',
    saving: 'सहेजा जा रहा है...',
    contactInformation: 'संपर्क जानकारी',
    emailAddress: 'ईमेल पता',
    emailCannotChange: 'ईमेल बदला नहीं जा सकता।',
    notProvided: 'उपलब्ध नहीं',
    phoneNumber: 'फ़ोन नंबर',
    notAddedYet: 'अभी तक नहीं जोड़ा',
    addressDetails: 'पता विवरण',
    residentialAddress: 'आवासीय पता',
    changePassword: 'पासवर्ड बदलें',
    currentPassword: 'वर्तमान पासवर्ड',
    newPassword: 'नया पासवर्ड',
    confirmNewPassword: 'नया पासवर्ड पुष्टि करें',
    updatePassword: 'पासवर्ड अपडेट करें',
    twoFactorAuth: 'टू-फैक्टर प्रमाणीकरण',
    twoFactorDesc: 'साइन इन करते समय सत्यापन कोड की आवश्यकता करके अपने खाते में सुरक्षा की एक अतिरिक्त परत जोड़ें।',
    paymentMethods: 'भुगतान के तरीके',
    addNew: '+ नया जोड़ें',
    primary: 'प्राथमिक',
    cardholderName: 'कार्डधारक का नाम',
    addNewCard: 'नया कार्ड जोड़ें',
    noTransactionsYet: 'अभी तक कोई लेनदेन नहीं',
    billingHistory: 'बिलिंग इतिहास',
    recentPayments: 'आपके हाल के भुगतान यहाँ दिखाई देंगे।',
    notificationsTitle: 'सूचनाएँ',
    securityAlerts: 'सुरक्षा अलर्ट',
    securityAlertsDesc: 'नए लॉगिन और सुरक्षा अपडेट की सूचना प्राप्त करें',
    marketingEmails: 'मार्केटिंग ईमेल',
    marketingEmailsDesc: 'नई सुविधाओं और अपडेट के बारे में समाचार प्राप्त करें',
    activityDigest: 'गतिविधि सारांश',
    activityDigestDesc: 'आपके खाते की गतिविधि का साप्ताहिक सारांश',
    display: 'प्रदर्शन',
    theme: 'थीम',
    dark: 'डार्क',
    light: 'लाइट',
    system: 'सिस्टम',
    language: 'भाषा',
    addNewCardTitle: 'नया कार्ड जोड़ें',
    cardType: 'कार्ड प्रकार',
    cardNumber: 'कार्ड नंबर',
    expiryDate: 'समाप्ति तिथि',
    addCard: 'कार्ड जोड़ें',
    joined: 'शामिल हुए',
  },
  'mr': {
    // Sidebar & Navigation
    dashboard: 'डॅशबोर्ड',
    markets: 'बाजार',
    terminal: 'टर्मिनल',
    portfolio: 'पोर्टफोलिओ',
    orders: 'ऑर्डर',
    funds: 'फंड',
    more: 'अजून',
    profile: 'प्रोफाइल',

    // Navbar
    searchPlaceholder: 'स्टॉक, ETF, निर्देशांक शोधा...',
    noResults: 'कोणतेही परिणाम सापडले नाहीत',
    notifications: 'सूचना',
    markAllRead: 'सर्व वाचले',
    noNewNotifications: 'कोणत्याही नवीन सूचना नाहीत',
    viewAllActivity: 'सर्व क्रियाकलाप पहा',

    // Profile Page
    account: 'खाते',
    accountSubtitle: 'तुमची वैयक्तिक माहिती आणि प्राधान्ये व्यवस्थापित करा.',
    personalInfo: 'वैयक्तिक माहिती',
    passwordSecurity: 'पासवर्ड आणि सुरक्षा',
    bankDetails: 'बँक तपशील',
    preferences: 'प्राधान्ये',
    signOut: 'साइन आउट',
    editProfile: 'प्रोफाइल संपादित करा',
    cancel: 'रद्द करा',
    saveChanges: 'बदल जतन करा',
    saving: 'जतन होत आहे...',
    contactInformation: 'संपर्क माहिती',
    emailAddress: 'ईमेल पत्ता',
    emailCannotChange: 'ईमेल बदलता येत नाही.',
    notProvided: 'उपलब्ध नाही',
    phoneNumber: 'फोन नंबर',
    notAddedYet: 'अजून जोडलेले नाही',
    addressDetails: 'पत्ता तपशील',
    residentialAddress: 'निवासी पत्ता',
    changePassword: 'पासवर्ड बदला',
    currentPassword: 'सध्याचा पासवर्ड',
    newPassword: 'नवीन पासवर्ड',
    confirmNewPassword: 'नवीन पासवर्ड पुष्टी करा',
    updatePassword: 'पासवर्ड अपडेट करा',
    twoFactorAuth: 'टू-फॅक्टर प्रमाणीकरण',
    twoFactorDesc: 'साइन इन करताना सत्यापन कोडची आवश्यकता करून तुमच्या खात्यात सुरक्षिततेचा अतिरिक्त स्तर जोडा.',
    paymentMethods: 'पेमेंट पद्धती',
    addNew: '+ नवीन जोडा',
    primary: 'प्राथमिक',
    cardholderName: 'कार्डधारकाचे नाव',
    addNewCard: 'नवीन कार्ड जोडा',
    noTransactionsYet: 'अजून कोणतेही व्यवहार नाहीत',
    billingHistory: 'बिलिंग इतिहास',
    recentPayments: 'तुमचे अलीकडील पेमेंट येथे दिसतील.',
    notificationsTitle: 'सूचना',
    securityAlerts: 'सुरक्षा सूचना',
    securityAlertsDesc: 'नवीन लॉगिन आणि सुरक्षा अपडेटबद्दल सूचना मिळवा',
    marketingEmails: 'मार्केटिंग ईमेल',
    marketingEmailsDesc: 'नवीन वैशिष्ट्ये आणि अपडेटबद्दल बातम्या मिळवा',
    activityDigest: 'क्रियाकलाप सारांश',
    activityDigestDesc: 'तुमच्या खात्याच्या क्रियाकलापाचा साप्ताहिक सारांश',
    display: 'प्रदर्शन',
    theme: 'थीम',
    dark: 'डार्क',
    light: 'लाइट',
    system: 'सिस्टम',
    language: 'भाषा',
    addNewCardTitle: 'नवीन कार्ड जोडा',
    cardType: 'कार्ड प्रकार',
    cardNumber: 'कार्ड नंबर',
    expiryDate: 'कालबाह्य तारीख',
    addCard: 'कार्ड जोडा',
    joined: 'सामील झाले',
  }
};

const languageNames = {
  'en': 'English (US)',
  'hi': 'हिन्दी (Hindi)',
  'mr': 'मराठी (Marathi)'
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
