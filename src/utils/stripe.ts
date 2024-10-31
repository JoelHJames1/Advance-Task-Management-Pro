import { loadStripe } from '@stripe/stripe-js';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  priceId: string;
  maxUsers: number;
}

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    priceId: 'price_1QFl6EDW8CaiRlmcdgp57xC4',
    maxUsers: 2,
    features: [
      'Up to 2 Users',
      'Basic Task Management',
      'File Sharing',
      'Email Support'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49.99,
    priceId: 'price_1QFl6uDW8CaiRlmcQuusqonK',
    maxUsers: 5,
    features: [
      'Up to 5 Users',
      'Advanced Task Management',
      'Priority Support',
      'Advanced Analytics',
      'Custom Workflows'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499.99,
    priceId: 'price_1QFl8cDW8CaiRlmcndkLjHSN',
    maxUsers: 1000,
    features: [
      'Up to 1000 Users',
      'Enterprise Features',
      '24/7 Support',
      'Custom Integration',
      'Dedicated Account Manager',
      'SLA Guarantee'
    ]
  }
];

export const stripePromise = loadStripe('pk_live_51QFkUkDW8CaiRlmcFoJ4drynAKnqHcwTYPTwEazhoQ5rLiVlOPPYWwHtRQe0T75oQq3uLbPWGWa6ONlgGgDYSHRT00SXBNQo6E');

export const createSubscription = async (userId: string, planId: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionStatus = async (userId: string) => {
  try {
    const response = await fetch(`/api/subscription-status?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};