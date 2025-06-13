import React from 'react';

const DonateMe: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <img
        src="https://aysvkiyuzqktcumdzxqh.supabase.co/storage/v1/object/public/images//my%20pic.png"
        alt="Donate"
        className="w-32 h-32 mb-6 rounded-full shadow-lg"
      />
      <h1 className="text-3xl font-bold mb-4">Support the Developer</h1>
      <p className="text-lg text-center mb-8 max-w-xl">
        Your donation helps me keep Myanmar Scholar running and free for
        everyone. Every contribution, big or small, makes a difference. Thank you
        for supporting our mission to empower students and scholars!
      </p>
      <a
        href="https://www.paypal.com/donate/?hosted_button_id=7VHQJMHHB85KN"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-full shadow-xl text-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <span role="img" aria-label="Donate" className="mr-2">
          💖
        </span>
        Donate with PayPal
      </a>
    </div>
  );
};

export default DonateMe;
