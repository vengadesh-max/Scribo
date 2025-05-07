import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Crown } from 'lucide-react';

const PricingTier: React.FC<{
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  onSelect: () => void;
}> = ({ title, price, description, features, recommended = false, onSelect }) => {
  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${recommended ? 'ring-2 ring-green-500' : ''}`}>
      {recommended && (
        <div className="bg-green-500 text-white text-center py-2 font-medium">
          Recommended
        </div>
      )}
      
      <div className="p-6 bg-white">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          {title}
          {recommended && <Crown size={20} className="ml-2 text-yellow-500" />}
        </h3>
        <div className="mt-4 flex items-baseline text-gray-900">
          <span className="text-5xl font-extrabold tracking-tight">{price}</span>
          <span className="ml-1 text-xl font-semibold">/month</span>
        </div>
        <p className="mt-5 text-lg text-gray-500">{description}</p>
        
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="ml-3 text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onSelect}
          className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md shadow text-white font-medium ${
            recommended 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-800 hover:bg-gray-900'
          }`}
        >
          {recommended ? 'Upgrade now' : 'Get started'}
        </button>
      </div>
    </div>
  );
};

const Premium: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleUpgrade = (tier: string) => {
    setUpgrading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      updateUser({ isPremium: true });
      setUpgrading(false);
      
      // Show success message and redirect
      alert(`Successfully upgraded to ${tier} tier!`);
      navigate('/profile');
    }, 1500);
  };

  // If already premium, show premium dashboard
  if (currentUser.isPremium) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-8 sm:p-10 sm:pb-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-yellow-300 mr-3" />
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Premium Membership
              </h2>
            </div>
            <div className="mt-4 text-white">
              <p>Thank you for being a premium member! Enjoy your enhanced features.</p>
            </div>
          </div>
          
          <div className="px-6 py-8 sm:p-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Premium Benefits</h3>
            
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Enhanced Analytics</h4>
                <p className="text-green-700">Track how your posts are performing with detailed metrics.</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">No Ads</h4>
                <p className="text-green-700">Enjoy an ad-free reading and writing experience.</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Custom Themes</h4>
                <p className="text-green-700">Personalize your profile with custom themes and colors.</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Priority Support</h4>
                <p className="text-green-700">Get faster responses from our support team.</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Stats</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Premium Views</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Referrals</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-gray-900">$0</p>
                  <p className="text-sm text-gray-500">Earnings</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-gray-900">∞</p>
                  <p className="text-sm text-gray-500">Reading Minutes</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => updateUser({ isPremium: false })}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Cancel Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Upgrade to Premium
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Take your writing to the next level with premium features
        </p>
      </div>
      
      {upgrading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-900">Processing your upgrade...</p>
          <p className="text-gray-500">This will only take a moment.</p>
        </div>
      ) : (
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          <PricingTier
            title="Basic"
            price="Free"
            description="Great for getting started with writing"
            features={[
              'Unlimited public posts',
              'Basic profile customization',
              'Community access'
            ]}
            onSelect={() => navigate('/profile')}
          />
          
          <PricingTier
            title="Pro"
            price="$5"
            description="Perfect for regular writers"
            features={[
              'Everything in Basic',
              'Advanced analytics',
              'Ad-free experience',
              'Custom themes',
              'Private posts'
            ]}
            recommended
            onSelect={() => handleUpgrade('Pro')}
          />
          
          <PricingTier
            title="Premium"
            price="$12"
            description="For serious content creators"
            features={[
              'Everything in Pro',
              'Priority support',
              'Monetization options',
              'Custom domain',
              'Early access to new features',
              'Premium community access'
            ]}
            onSelect={() => handleUpgrade('Premium')}
          />
        </div>
      )}
      
      <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        
        <dl className="space-y-6">
          <div>
            <dt className="text-lg font-medium text-gray-900">Can I cancel anytime?</dt>
            <dd className="mt-2 text-gray-600">Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing cycle.</dd>
          </div>
          
          <div>
            <dt className="text-lg font-medium text-gray-900">How do I get a refund?</dt>
            <dd className="mt-2 text-gray-600">If you're not satisfied with your premium experience, contact our support team within 14 days of purchase for a full refund.</dd>
          </div>
          
          <div>
            <dt className="text-lg font-medium text-gray-900">What payment methods do you accept?</dt>
            <dd className="mt-2 text-gray-600">We accept all major credit cards, PayPal, and select regional payment methods.</dd>
          </div>
          
          <div>
            <dt className="text-lg font-medium text-gray-900">Do you offer team or enterprise plans?</dt>
            <dd className="mt-2 text-gray-600">Yes! Contact our sales team for custom pricing and features tailored to your organization's needs.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Premium;