import React from 'react';
import { useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';

const stripePromise = loadStripe('pk_live_51QFkUkDW8CaiRlmcFoJ4drynAKnqHcwTYPTwEazhoQ5rLiVlOPPYWwHtRQe0T75oQq3uLbPWGWa6ONlgGgDYSHRT00SXBNQo6E');

const plans = [
  {
    id: 'price_1QFl6EDW8CaiRlmcdgp57xC4',
    name: 'Basic',
    price: '$9.99',
    features: [
      'Up to 2 Users',
      'Basic Task Management',
      'File Sharing',
      'Email Support'
    ],
    priceId: 'price_1QFl6EDW8CaiRlmcdgp57xC4'
  },
  {
    id: 'price_1QFl6uDW8CaiRlmcQuusqonK',
    name: 'Professional',
    price: '$49.99',
    features: [
      'Up to 5 Users',
      'Advanced Task Management',
      'Priority Support',
      'Advanced Analytics',
      'Custom Workflows'
    ],
    priceId: 'price_1QFl6uDW8CaiRlmcQuusqonK'
  },
  {
    id: 'price_1QFl8cDW8CaiRlmcndkLjHSN',
    name: 'Enterprise',
    price: '$499.99',
    features: [
      'Up to 1000 Users',
      'Enterprise Features',
      '24/7 Support',
      'Custom Integration',
      'Dedicated Account Manager',
      'SLA Guarantee'
    ],
    priceId: 'price_1QFl8cDW8CaiRlmcndkLjHSN'
  }
];

const SubscriptionPlanCard = ({ plan, onSelect, isSelected }: any) => (
  <div className={`p-6 rounded-lg shadow-lg ${
    isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'
  }`}>
    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
    <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm">/month</span></p>
    <ul className="mb-6 space-y-2">
      {plan.features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button
      onClick={() => onSelect(plan)}
      className={`w-full py-2 px-4 rounded ${
        isSelected
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {isSelected ? 'Selected' : 'Select Plan'}
    </button>
  </div>
);

const SubscriptionPlansContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setError(null);
  };

  const handleSubscribe = async () => {
    if (!stripe || !elements || !selectedPlan || !user) {
      setError('Please select a plan to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.priceId,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Handle successful subscription
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Select the perfect plan for your team's needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            onSelect={handlePlanSelect}
            isSelected={selectedPlan?.id === plan.id}
          />
        ))}
      </div>

      {error && (
        <div className="mt-6 text-center text-red-600">
          {error}
        </div>
      )}

      {selectedPlan && (
        <div className="mt-8 text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading || !stripe}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>
      )}
    </div>
  );
};

const SubscriptionPlans = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionPlansContent />
  </Elements>
);

export default SubscriptionPlans;