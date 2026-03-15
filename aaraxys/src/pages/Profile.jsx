import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, CreditCard, LogOut, Settings, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

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
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
      activeTab === tab 
        ? 'bg-primary/10 text-primary' 
        : 'text-text-main/70 hover:bg-border/30 hover:text-text-main'
    }`;
  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Account</h1>
        <p className="text-text-main/60 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Column - Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('personal')}
            className={navButtonClasses('personal')}
          >
            <User size={18} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={navButtonClasses('security')}
          >
            <Shield size={18} /> Password & Security
          </button>
          <button 
            onClick={() => setActiveTab('bank')}
            className={navButtonClasses('bank')}
          >
            <CreditCard size={18} /> Bank Details
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={navButtonClasses('preferences')}
          >
            <Settings size={18} /> Preferences
          </button>
          
          <div className="pt-6 mt-6 border-t border-border">
             <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-danger/80 hover:bg-danger/10 hover:text-danger rounded-lg transition-colors font-medium"
             >
               <LogOut size={18} /> Sign Out
             </button>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 bg-surface border border-border rounded-xl p-6">
           
           <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <div className="w-24 h-24 rounded-full bg-border flex items-center justify-center overflow-hidden border-4 border-background">
                 <User size={48} className="text-text-main/40" />
              </div>
              <div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="text-2xl font-bold bg-background border border-border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary text-text-main w-full max-w-[250px]"
                    />
                 ) : (
                    <h2 className="text-2xl font-bold text-text-main">{user?.name || 'Guest User'}</h2>
                 )}
                 <p className="text-text-main/60 mt-1 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-medium">
                       U{(user?._id || '12498').substring(0,5).toUpperCase()}
                    </span>
                    Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                 </p>
              </div>
              
              {isEditing ? (
                 <div className="ml-auto flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)} 
                      disabled={isLoading}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-border/50 text-text-main transition-colors flex items-center gap-2"
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile} 
                      disabled={isLoading}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>
              ) : (
                 <button 
                   onClick={() => setIsEditing(true)} 
                   className="ml-auto px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-border/50 text-text-main transition-colors flex items-center gap-2"
                 >
                     <Edit2 size={16} /> Edit Profile
                 </button>
              )}
           </div>
           
           {activeTab === 'personal' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Contact Information</h3>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                       <Mail size={18} className="text-text-main/50 mt-0.5" />
                       <div className="flex-1">
                          <p className="text-sm text-text-main/60 mb-0.5">Email Address</p>
                          <p className="font-medium text-text-main">{user?.email || 'Not provided'}</p>
                          {isEditing && <p className="text-xs text-text-main/40 mt-1">Email cannot be changed.</p>}
                       </div>
                    </div>
                    <div className="flex gap-4 items-start">
                       <Phone size={18} className="text-text-main/50 mt-0.5" />
                       <div className="flex-1">
                          <p className="text-sm text-text-main/60 mb-0.5">Phone Number</p>
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
                               {user?.phone || 'Not added yet'}
                             </p>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
              
              <div>
                 <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Address details</h3>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                       <MapPin size={18} className="text-text-main/50 mt-0.5" />
                       <div className="flex-1">
                          <p className="font-medium text-text-main mb-1">Residential Address</p>
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
                               {user?.address || 'Not added yet'}
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
                   <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">Change Password</h3>
                   <form className="max-w-md space-y-4">
                      <div>
                         <label className="block text-sm text-text-main/60 mb-1.5">Current Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors" />
                      </div>
                      <div>
                         <label className="block text-sm text-text-main/60 mb-1.5">New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors" />
                      </div>
                      <div>
                         <label className="block text-sm text-text-main/60 mb-1.5">Confirm New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors" />
                      </div>
                      <button type="button" className="px-4 py-2 bg-primary text-[#0d0d12] font-semibold rounded-lg hover:bg-primary/90 transition-colors mt-2">
                         Update Password
                      </button>
                   </form>
                </div>
                
                <div className="pt-8 border-t border-border">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Two-Factor Authentication</h3>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-border transition-colors focus:outline-none">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-text-main transition-transform translate-x-1" />
                      </button>
                   </div>
                   <p className="text-sm text-text-main/60 max-w-lg">
                      Add an extra layer of security to your account by requiring a verification code when you sign in.
                   </p>
                </div>
             </div>
           )}

           {activeTab === 'bank' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Payment Methods</h3>
                      <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                         + Add New
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Premium Card Design */}
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-border p-6 shadow-lg group hover:shadow-primary/5 transition-all">
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard size={80} />
                         </div>
                         <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div className="flex justify-between items-start">
                               <div className="font-bold text-white tracking-wider">Visa</div>
                               <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded">Primary</span>
                            </div>
                            <div>
                               <p className="text-white/60 font-mono text-sm tracking-widest mb-1">•••• •••• •••• 4242</p>
                               <div className="flex justify-between items-center">
                                  <p className="text-white text-sm font-medium">{user?.name || 'Cardholder Name'}</p>
                                  <p className="text-white/60 text-sm">12/28</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      {/* Add Card Placeholder */}
                      <button className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-text-main/50 hover:text-text-main hover:border-text-main/30 transition-colors h-full min-h-[160px]">
                         <div className="w-10 h-10 rounded-full bg-border/50 flex items-center justify-center">
                            <span className="text-xl">+</span>
                         </div>
                         <span className="text-sm font-medium">Add new card</span>
                      </button>
                   </div>
                </div>
                
                <div className="pt-8 border-t border-border">
                   <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Billing History</h3>
                   <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mx-auto mb-4">
                         <CreditCard size={24} className="text-text-main/40" />
                      </div>
                      <p className="text-text-main font-medium">No transactions yet</p>
                      <p className="text-sm text-text-main/50 mt-1">Your recent payments will appear here.</p>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'preferences' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                   <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">Notifications</h3>
                   <div className="space-y-4 max-w-xl">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                         <div>
                            <p className="font-medium text-text-main text-sm">Security Alerts</p>
                            <p className="text-xs text-text-main/50 mt-0.5">Get notified about new logins and security updates</p>
                         </div>
                         <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none">
                           <span className="inline-block h-4 w-4 transform rounded-full bg-[#0d0d12] transition-transform translate-x-6" />
                         </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                         <div>
                            <p className="font-medium text-text-main text-sm">Marketing Emails</p>
                            <p className="text-xs text-text-main/50 mt-0.5">Receive news about new features and updates</p>
                         </div>
                         <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-border transition-colors focus:outline-none">
                           <span className="inline-block h-4 w-4 transform rounded-full bg-text-main transition-transform translate-x-1" />
                         </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                         <div>
                            <p className="font-medium text-text-main text-sm">Activity Digest</p>
                            <p className="text-xs text-text-main/50 mt-0.5">Weekly summary of your account activity</p>
                         </div>
                         <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none">
                           <span className="inline-block h-4 w-4 transform rounded-full bg-[#0d0d12] transition-transform translate-x-6" />
                         </button>
                      </div>
                   </div>
                </div>
                
                <div className="pt-8 border-t border-border">
                   <h3 className="text-sm font-bold text-text-main mb-6 uppercase tracking-wider">Display</h3>
                   <div className="max-w-xl space-y-6">
                      <div>
                         <label className="block text-sm font-medium text-text-main mb-3">Theme</label>
                         <div className="grid grid-cols-3 gap-3">
                            <button className="border-2 border-primary bg-background rounded-lg p-3 flex flex-col items-center gap-2">
                               <div className="w-full h-12 bg-[#0d0d12] border border-border rounded-md"></div>
                               <span className="text-xs font-medium text-primary">Dark</span>
                            </button>
                            <button className="border border-border opacity-50 cursor-not-allowed bg-background rounded-lg p-3 flex flex-col items-center gap-2">
                               <div className="w-full h-12 bg-white border border-gray-200 rounded-md"></div>
                               <span className="text-xs font-medium text-text-main/50">Light (Coming Soon)</span>
                            </button>
                            <button className="border border-border opacity-50 cursor-not-allowed bg-background rounded-lg p-3 flex flex-col items-center gap-2">
                               <div className="w-full h-12 bg-gradient-to-r from-[#0d0d12] to-white border border-border rounded-md"></div>
                               <span className="text-xs font-medium text-text-main/50">System</span>
                            </button>
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-text-main mb-2">Language</label>
                         <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                         </select>
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
