import React from 'react';

const PricingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Pricing Plans</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
          <div className="text-4xl font-bold mb-6">₦0</div>
          <ul className="space-y-3 mb-8">
            <li>✓ Create a fundraising campaign</li>
            <li>✓ Share campaign link publicly</li>
            <li>✓ Receive donations</li>
            <li>✓ Appear in general campaign listings</li>
            <li>✓ Basic campaign visibility</li>
            <li>✓ Manual review process</li>
            <li>✓ Standard withdrawal processing</li>
            <li>✓ Access to community support</li>
            <li>✓ Use platform at no cost</li>
          </ul>
          <button className="w-full py-3 px-4 bg-primary text-white rounded-lg">Get Started</button>
        </div>

        {/* Premium Plan */}
        <div className="border-2 border-primary rounded-lg p-8 relative">
          <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm">Recommended</div>
          <h2 className="text-2xl font-semibold mb-4">Premium Plan</h2>
          <div className="text-4xl font-bold mb-6">5% of donations</div>
          <p className="text-gray-600 mb-6">+ transaction fees</p>
          <ul className="space-y-3 mb-8">
            <li>✓ All Free Plan benefits</li>
            <li>✓ Priority campaign visibility</li>
            <li>✓ Featured in Urgent Care section</li>
            <li>✓ Social media promotion by TorchLife</li>
            <li>✓ AI-assisted story writing</li>
            <li>✓ Guided campaign setup</li>
            <li>✓ Faster review and approval</li>
            <li>✓ Priority withdrawal processing</li>
            <li>✓ Verified campaign badge</li>
            <li>✓ Spotlight campaign access</li>
            <li>✓ Dedicated support guidance</li>
            <li>✓ Future benefits eligibility</li>
          </ul>
          <button className="w-full py-3 px-4 bg-primary text-white rounded-lg">Upgrade to Premium</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;