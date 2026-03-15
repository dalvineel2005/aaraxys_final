import React from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-text-main/70 leading-relaxed mb-4">
          We're here to help! If you have any questions or run into any issues, you can reach out to our support team.
        </p>
        
        <div className="mt-8 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Email Support</h3>
            <p className="text-text-main/70">support@arayxs.com</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Phone</h3>
            <p className="text-text-main/70">+91 1800-ARAYXS-00 (Toll Free)</p>
          </div>
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Corporate Office</h3>
            <p className="text-text-main/70">
              ARAYXS Technologies Pvt. Ltd.<br/>
              123 Tech Park, Financial District<br/>
              Mumbai, MH 400001, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
