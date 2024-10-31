import React from 'react';
import { useAuth } from '../context/AuthContext';
import { createSubscription, Plan, plans } from '../utils/stripe';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      setError('Please log in to subscribe');
      return;
    }

    try {
      setLoading(plan.id);
      setError(null);
      const { clientSecret, subscriptionId } = await createSubscription(
        user.uid,
        plan.id
      );

      // Redirect to checkout
      window.location.href = `/checkout/${subscriptionId}?client_secret=${clientSecret}`;
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to create subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your team's needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 bg-white ${
                plan.id === 'pro' ? 'border-2 border-indigo-500' : ''
              }`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm text-gray-500">
                  {plan.id === 'pro' && (
                    <span className="block text-indigo-600 font-medium mb-2">
                      Most Popular
                    </span>
                  )}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /month
                  </span>
                </p>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                  className={`mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md text-center transition duration-150 ease-in-out ${
                    loading === plan.id ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading === plan.id ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <Check
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-8 text-center text-red-600">{error}</div>
        )}

        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;