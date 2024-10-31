import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe('pk_live_51QFkUkDW8CaiRlmcFoJ4drynAKnqHcwTYPTwEazhoQ5rLiVlOPPYWwHtRQe0T75oQq3uLbPWGWa6ONlgGgDYSHRT00SXBNQo6E');

const Checkout: React.FC = () => {
  const { clientSecret } = useParams<{ clientSecret: string }>();

  if (!clientSecret) {
    return <div>Invalid checkout session</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Subscription</h1>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;