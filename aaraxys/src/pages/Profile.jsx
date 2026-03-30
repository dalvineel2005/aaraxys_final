import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   User,
   Mail,
   Phone,
   MapPin,
   Lock,
   Shield,
   Globe,
   Bell,
   CreditCard,
   ChevronRight,
   Camera,
   Check,
   X,
   Settings,
   LogOut,
   Edit2,
   Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
   const { user, logout, updateProfile } = useAuth();
   const navigate = useNavigate();
   const { addToast } = useToast();
   const { t, language, setLanguage, languageNames } = useLanguage();
   const [activeTab, setActiveTab] = useState('personal');
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      address: ''
   });

   const [cards, setCards] = useState([
      { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', isPrimary: true }
   ]);
   const [showCardModal, setShowCardModal] = useState(false);
   const [newCard, setNewCard] = useState({ type: 'Visa', number: '', expiry: '', name: '' });

   // Theme state
   const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

   // Apply theme to document
   useEffect(() => {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
         document.documentElement.classList.add('dark');
         document.documentElement.setAttribute('data-theme', 'dark');
      } else {
         document.documentElement.classList.remove('dark');
         document.documentElement.removeAttribute('data-theme');
      }
   }, [theme]);

   useEffect(() => {
      if (user) {
         setFormData({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || ''
         });
      }
   }, [user]);

   const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSaveProfile = async () => {
      setIsLoading(true);
      try {
         if (updateProfile) {
            const result = await updateProfile(formData);
            if (result.success) {
               addToast('Profile updated successfully', 'success');
               setIsEditing(false);
            } else {
               addToast(result.message || 'Failed to update profile', 'error');
            }
         } else {
            addToast('Update profile function not implemented yet', 'warning');
         }
      } catch (error) {
         addToast('An error occurred during update', 'error');
      } finally {
         setIsLoading(false);
      }
   };

   const navButtonClasses = (tab) =>
      `flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-lg transition-colors font-medium whitespace-nowrap shrink-0 md:w-full ${activeTab === tab
         ? 'bg-primary/10 text-primary'
         : 'text-text-main/70 hover:bg-border/30 hover:text-text-main'
      }`;
   return (
      <div className="p-4 md:p-6 h-full flex flex-col animate-in fade-in duration-500 max-w-5xl mx-auto w-full pb-24 md:pb-6">
         <div className="mb-6 md:mb-8">
            <h1 className="text-2xl font-bold text-text-main tracking-tight">{t('account')}</h1>
            <p className="text-text-main/60 mt-1">{t('accountSubtitle')}</p>
         </div>

         <div className="flex flex-col md:flex-row gap-6">

            {/* Left Column - Navigation Sidebar */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-3 md:gap-0 md:space-y-1">
               <div className="flex overflow-x-auto md:flex-col gap-2 md:gap-1 pb-2 md:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button
                     onClick={() => setActiveTab('personal')}
                     className={navButtonClasses('personal')}
                  >
                     <User size={18} /> {t('personalInfo')}
                  </button>
                  <button
                     onClick={() => setActiveTab('security')}
                     className={navButtonClasses('security')}
                  >
                     <Lock size={18} /> {t('passwordSecurity')}
                  </button>
                  <button
                     onClick={() => setActiveTab('bank')}
                     className={navButtonClasses('bank')}
                  >
                     <CreditCard size={18} /> {t('bankDetails')}
                  </button>
                  <button
                     onClick={() => setActiveTab('preferences')}
                     className={navButtonClasses('preferences')}
                  >
                     <Settings size={18} /> {t('preferences')}
                  </button>
               </div>

               <div className="md:pt-6 md:mt-6 md:border-t md:border-border">
                  <button
                     onClick={() => {
                        logout();
                        navigate('/login');
                     }}
                     className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2.5 md:py-3 text-danger/80 hover:bg-danger/10 hover:text-danger rounded-lg transition-colors font-medium shrink-0 border border-danger/20 md:border-none"
                  >
                     <LogOut size={18} /> {t('signOut')}
                  </button>
               </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex-1 bg-surface border border-border rounded-xl p-4 sm:p-6 overflow-hidden md:overflow-visible min-w-0">

               <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full bg-border flex items-center justify-center overflow-hidden border-4 border-background">
                     <User className="text-text-main/40 w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <div className="flex-1 min-w-0 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                     {isEditing ? (
                        <input
                           type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           className="text-xl sm:text-2xl font-bold bg-background border border-border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary text-text-main w-full max-w-[250px] text-center sm:text-left"
                        />
                     ) : (
                        <h2 className="text-xl sm:text-2xl font-bold text-text-main truncate w-full">{user?.name || 'Guest User'}</h2>
                     )}
                     <p className="text-text-main/60 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full">
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-medium shrink-0">
                           U{(user?._id || '12498').substring(0, 5).toUpperCase()}
                        </span>
                        <span className="truncate">{t('joined')} {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                     </p>
                  </div>

                  <div className="w-full sm:w-auto flex justify-center sm:justify-end shrink-0 mt-2 sm:mt-0">
                     {isEditing ? (
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button
                              onClick={() => setIsEditing(false)}
                              disabled={isLoading}
                              className="flex-1 sm:flex-none justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-border/50 text-text-main transition-colors flex items-center gap-2"
                           >
                              <X size={16} /> <span className="hidden xs:inline">{t('cancel')}</span>
                           </button>
                           <button
                              onClick={handleSaveProfile}
                              disabled={isLoading}
                              className="flex-1 sm:flex-none justify-center px-4 py-2 bg-primary text-[#0d0d12] rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                           >
                              <Save size={16} /> {isLoading ? t('saving') : t('saveChanges')}
                           </button>
                        </div>
                     ) : (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="w-full sm:w-auto justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-border/50 text-text-main transition-colors flex items-center gap-2"
                        >
                           <Edit2 size={16} /> {t('editProfile')}
                        </button>
                     )}
                  </div>
               </div>

               {activeTab === 'personal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">{t('contactInformation')}</h3>
                        <div className="space-y-4">
                           <div className="flex gap-4 items-start">
                              <Mail size={18} className="text-text-main/50 mt-0.5" />
                              <div className="flex-1">
                                 <p className="text-sm text-text-main/60 mb-0.5">{t('emailAddress')}</p>
                                 <p className="font-medium text-text-main">{user?.email || t('notProvided')}</p>
                                 {isEditing && <p className="text-xs text-text-main/40 mt-1">{t('emailCannotChange')}</p>}
                              </div>
                           </div>
                           <div className="flex gap-4 items-start">
                              <Phone size={18} className="text-text-main/50 mt-0.5" />
                              <div className="flex-1">
                                 <p className="text-sm text-text-main/60 mb-0.5">{t('phoneNumber')}</p>
                                 {isEditing ? (
                                    <input
                                       type="text"
                                       name="phone"
                                       value={formData.phone}
                                       onChange={handleInputChange}
                                       placeholder="+1 (555) 000-0000"
                                       className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary text-text-main mt-1"
                                    />
                                 ) : (
                                    <p className={`font-medium ${user?.phone ? 'text-text-main' : 'text-text-main/50 italic'}`}>
                                       {user?.phone || t('notAddedYet')}
                                    </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div>
                        <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">{t('addressDetails')}</h3>
                        <div className="space-y-4">
                           <div className="flex gap-4 items-start">
                              <MapPin size={18} className="text-text-main/50 mt-0.5" />
                              <div className="flex-1">
                                 <p className="font-medium text-text-main mb-1">{t('residentialAddress')}</p>
                                 {isEditing ? (
                                    <textarea
                                       name="address"
                                       value={formData.address}
                                       onChange={handleInputChange}
                                       placeholder="123 Main St, City, Country"
                                       rows="3"
                                       className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary text-text-main resize-none"
                                    ></textarea>
                                 ) : (
                                    <p className={`text-sm leading-relaxed ${user?.address ? 'text-text-main/80' : 'text-text-main/50 italic mt-1'}`}>
                                       {user?.address || t('notAddedYet')}
                                    </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'security' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div>
                        <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">{t('changePassword')}</h3>
                        <form className="max-w-md space-y-4">
                           <div>
                              <label className="block text-sm text-text-main/60 mb-1.5">{t('currentPassword')}</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors" />
                           </div>
                           <div>
                              <label className="block text-sm text-text-main/60 mb-1.5">{t('newPassword')}</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors" />
                           </div>
                           <div>
                              <label className="block text-sm text-text-main/60 mb-1.5">{t('confirmNewPassword')}</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors" />
                           </div>
                           <button type="button" className="px-4 py-2 bg-primary text-[#0d0d12] font-semibold rounded-lg hover:bg-primary/90 transition-colors mt-2">
                              {t('updatePassword')}
                           </button>
                        </form>
                     </div>

                     <div className="pt-8 border-t border-border">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">{t('twoFactorAuth')}</h3>
                           <button
                              onClick={async () => {
                                 if (isLoading) return;
                                 setIsLoading(true);
                                 try {
                                    const result = await updateProfile({ twoFactorEnabled: !user?.twoFactorEnabled });
                                    if (result.success) {
                                       addToast(`Two-factor authentication ${!user?.twoFactorEnabled ? 'enabled' : 'disabled'}`, 'success');
                                    } else {
                                       addToast(result.message || 'Failed to update 2FA status', 'error');
                                    }
                                 } catch (err) {
                                    addToast('An error occurred', 'error');
                                 } finally {
                                    setIsLoading(false);
                                 }
                              }}
                              disabled={isLoading}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${user?.twoFactorEnabled ? 'bg-primary' : 'bg-border'}`}
                           >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-text-main transition-transform ${user?.twoFactorEnabled ? 'translate-x-6 bg-[#0d0d12]' : 'translate-x-1'}`} />
                           </button>
                        </div>
                        <p className="text-sm text-text-main/60 max-w-lg">
                           {t('twoFactorDesc')}
                        </p>
                     </div>
                  </div>
               )}

               {activeTab === 'bank' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div>
                        <div className="flex items-center justify-between mb-6">
                           <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">{t('paymentMethods')}</h3>
                           <button
                              onClick={() => setShowCardModal(true)}
                              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                           >
                              {t('addNew')}
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* Dynamic Cards */}
                           {cards.map((card) => (
                              <div key={card.id} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-border p-6 shadow-lg group hover:shadow-primary/5 transition-all h-[180px]">
                                 <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CreditCard size={80} />
                                 </div>
                                 <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                                    <div className="flex justify-between items-start">
                                       <div className="font-bold text-white tracking-wider">{card.type}</div>
                                       {card.isPrimary && <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded">{t('primary')}</span>}
                                    </div>
                                    <div className="mt-auto">
                                       <p className="text-white/60 font-mono text-sm tracking-widest mb-1">•••• •••• •••• {card.last4}</p>
                                       <div className="flex justify-between items-center">
                                          <p className="text-white text-sm font-medium">{card.name || user?.name || t('cardholderName')}</p>
                                          <p className="text-white/60 text-sm">{card.expiry}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}

                           {/* Add Card Placeholder */}
                           <button
                              onClick={() => setShowCardModal(true)}
                              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-text-main/50 hover:text-text-main hover:border-text-main/30 transition-colors h-[180px]"
                           >
                              <div className="w-10 h-10 rounded-full bg-border/50 flex items-center justify-center">
                                 <span className="text-xl">+</span>
                              </div>
                              <span className="text-sm font-medium">{t('addNewCard')}</span>
                           </button>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-border">
                        <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">{t('billingHistory')}</h3>
                        <div className="text-center py-8">
                           <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mx-auto mb-4">
                              <CreditCard size={24} className="text-text-main/40" />
                           </div>
                           <p className="text-text-main font-medium">{t('noTransactionsYet')}</p>
                           <p className="text-sm text-text-main/50 mt-1">{t('recentPayments')}</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'preferences' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div>
                        <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">{t('notificationsTitle')}</h3>
                        <div className="space-y-4 max-w-xl">
                           <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                              <div>
                                 <p className="font-medium text-text-main text-sm">{t('securityAlerts')}</p>
                                 <p className="text-xs text-text-main/50 mt-0.5">{t('securityAlertsDesc')}</p>
                              </div>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none">
                                 <span className="inline-block h-4 w-4 transform rounded-full bg-[#0d0d12] transition-transform translate-x-6" />
                              </button>
                           </div>
                           <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                              <div>
                                 <p className="font-medium text-text-main text-sm">{t('marketingEmails')}</p>
                                 <p className="text-xs text-text-main/50 mt-0.5">{t('marketingEmailsDesc')}</p>
                              </div>
                              <button
                                 onClick={async () => {
                                    if (isLoading) return;
                                    setIsLoading(true);
                                    try {
                                       const result = await updateProfile({ marketingEmails: !user?.marketingEmails });
                                       if (result.success) {
                                          addToast(`Marketing emails ${!user?.marketingEmails ? 'enabled' : 'disabled'}`, 'success');
                                       } else {
                                          addToast(result.message || 'Failed to update preferences', 'error');
                                       }
                                    } catch (err) {
                                       addToast('An error occurred', 'error');
                                    } finally {
                                       setIsLoading(false);
                                    }
                                 }}
                                 disabled={isLoading}
                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${user?.marketingEmails ? 'bg-primary' : 'bg-border'}`}
                              >
                                 <span className={`inline-block h-4 w-4 transform rounded-full bg-text-main transition-transform ${user?.marketingEmails ? 'translate-x-6 bg-[#0d0d12]' : 'translate-x-1'}`} />
                              </button>
                           </div>
                           <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                              <div>
                                 <p className="font-medium text-text-main text-sm">{t('activityDigest')}</p>
                                 <p className="text-xs text-text-main/50 mt-0.5">{t('activityDigestDesc')}</p>
                              </div>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none">
                                 <span className="inline-block h-4 w-4 transform rounded-full bg-[#0d0d12] transition-transform translate-x-6" />
                              </button>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-border">
                        <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">{t('display')}</h3>
                        <div className="max-w-xl space-y-6">
                           <div>
                              <label className="block text-sm font-medium text-text-main mb-3">{t('theme')}</label>
                              <div className="grid grid-cols-3 gap-3">
                                 <button
                                    onClick={() => setTheme('dark')}
                                    className={`border-2 rounded-lg p-3 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                                 >
                                    <div className="w-full h-12 bg-[#0b0f19] border border-border rounded-md"></div>
                                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-primary' : 'text-text-main/60'}`}>{t('dark')}</span>
                                 </button>
                                 <button
                                    onClick={() => setTheme('light')}
                                    className={`border-2 rounded-lg p-3 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                                 >
                                    <div className="w-full h-12 bg-[#f8fafc] border border-border rounded-md"></div>
                                    <span className={`text-xs font-medium ${theme === 'light' ? 'text-primary' : 'text-text-main/60'}`}>{t('light')}</span>
                                 </button>
                                 <button className="border border-border opacity-50 cursor-not-allowed bg-background rounded-lg p-3 flex flex-col items-center gap-2">
                                    <div className="w-full h-12 bg-gradient-to-r from-[#0b0f19] to-[#f8fafc] border border-border rounded-md"></div>
                                    <span className="text-xs font-medium text-text-main/50">{t('system')}</span>
                                 </button>
                              </div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-text-main mb-2">{t('language')}</label>
                              <select
                                 value={language}
                                 onChange={(e) => setLanguage(e.target.value)}
                                 className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                              >
                                 {Object.entries(languageNames).map(([code, name]) => (
                                    <option key={code} value={code}>{name}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Add Card Modal */}
         {showCardModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
                     <h3 className="text-lg font-bold text-text-main">{t('addNewCardTitle')}</h3>
                     <button onClick={() => setShowCardModal(false)} className="text-text-main/50 hover:text-text-main transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <form className="p-6 space-y-4" onSubmit={(e) => {
                     e.preventDefault();
                     if (!newCard.number || !newCard.expiry || !newCard.name) {
                        addToast('Please fill all fields', 'warning');
                        return;
                     }
                     const card = {
                        id: Date.now(),
                        type: newCard.type,
                        last4: newCard.number.slice(-4),
                        expiry: newCard.expiry,
                        name: newCard.name,
                        isPrimary: false
                     };
                     setCards([...cards, card]);
                     addToast('Payment method added successfully', 'success');
                     setShowCardModal(false);
                     setNewCard({ type: 'Visa', number: '', expiry: '', name: '' });
                  }}>
                     <div>
                        <label className="block text-sm font-medium text-text-main/70 mb-1.5">{t('cardType')}</label>
                        <select
                           className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                           value={newCard.type}
                           onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                        >
                           <option value="Visa">Visa</option>
                           <option value="Mastercard">Mastercard</option>
                           <option value="Amex">American Express</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-text-main/70 mb-1.5">{t('cardNumber')}</label>
                        <input
                           type="text"
                           placeholder="0000 0000 0000 0000"
                           maxLength="16"
                           className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                           value={newCard.number}
                           onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '') })}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-text-main/70 mb-1.5">{t('expiryDate')}</label>
                           <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                              value={newCard.expiry}
                              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-text-main/70 mb-1.5">CVV</label>
                           <input
                              type="password"
                              placeholder="•••"
                              maxLength="3"
                              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-text-main/70 mb-1.5">{t('cardholderName')}</label>
                        <input
                           type="text"
                           placeholder="e.g. John Doe"
                           className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                           value={newCard.name}
                           onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                        />
                     </div>
                     <button type="submit" className="w-full py-3 bg-primary text-[#0d0d12] font-bold rounded-xl hover:bg-primary/90 transition-colors mt-4">
                        {t('addCard')}
                     </button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default Profile;
