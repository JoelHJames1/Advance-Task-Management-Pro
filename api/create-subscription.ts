import Stripe from 'stripe';
import { db } from '../src/utils/firebase';
import { plans } from '../src/utils/stripe';

const stripe = new Stripe('sk_test_51Q5E29RpXzBOxGTvHhrghkUJa7a0jCe1OTSeqrxI2JDzBKZ8fwupmy1hyQYXCPxhUAdbcN9Oh2o1pSSzbOUNH5PZ007wLsf1ga', {
  apiVersion: '2023-10-16'
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId } = req.body;
    
    // Get the plan details
    const plan = plans.find(p => p.priceId === priceId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Create a customer
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        planId: plan.id,
        maxUsers: plan.maxUsers.toString()
      }
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    // Update the subscription document in Firestore
    await db.collection('subscriptions').doc(req.body.subscriptionId).update({
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customer.id,
      status: subscription.status,
      planId: plan.id,
      maxUsers: plan.maxUsers
    });

    // Update user document with subscription info
    await db.collection('users').doc(userId).update({
      subscriptionStatus: subscription.status,
      subscriptionPlan: plan.id,
      maxUsers: plan.maxUsers,
      stripeCustomerId: customer.id
    });

    return res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}