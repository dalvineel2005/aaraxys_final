import React from 'react';
import Navbar from '../components/Navbar';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-text-main/70 leading-relaxed mb-4">
          Welcome to ARAYXS. By accessing our platform, you agree to be bound by these Terms of Service. 
          Please read them carefully before using our services.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-text-main/70 leading-relaxed mb-4">
          By registering for an account, you confirm that you are over 18 and capable of entering into a legally binding agreement.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Trading Risks</h2>
        <p className="text-text-main/70 leading-relaxed mb-4">
          Trading involves significant risk. You should ensure that you fully understand all risks before trading. ARAYXS does not provide investment advice.
        </p>
      </div>
    </div>
  );
};

export default Terms;
