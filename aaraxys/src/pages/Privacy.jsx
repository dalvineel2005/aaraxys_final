import React from 'react';
import Navbar from '../components/Navbar';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-text-main/70 leading-relaxed mb-4">
          At ARAYXS, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Information Collection</h2>
        <p className="text-text-main/70 leading-relaxed mb-4">
          We collect information that you manually provide to us during account registration, as well as data gathered automatically while you navigate our platform.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Data Security</h2>
        <p className="text-text-main/70 leading-relaxed mb-4">
          We implement bank-grade security protocols, including 256-bit encryption, to ensure your sensitive data is always secure.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
