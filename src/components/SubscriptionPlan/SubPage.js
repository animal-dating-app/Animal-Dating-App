import React from 'react';
import SubscriptionPlanCard from './SubCard';

const SubscriptionPlansPage = () => {
  return (
    <div className="container">
      <h2>Subscription Plans</h2>
      <div className="subscription-plan">
        <SubscriptionPlanCard title="Basic (Free)" features={['Profile Creation', 'Event Calendar', 'Limited Messaging']} />
      </div>
      <div className="subscription-plan">
        <SubscriptionPlanCard title="Premium (Monthly - $9.99)" features={['Everything in Basic, plus:', 'Enhanced Matching Algorithm', 'Unlimited Messaging',  'Ad-Free Browsing', 'Advanced Profile Features']} />
      </div>
      <div className="subscription-plan">
        <SubscriptionPlanCard title="VIP (Yearly - $99.99)" features={['Everything in Premium, plus:', 'Priority Customer Support', 'Exclusive Events', 'Featured Profiles', 'Extended Match History']} />
      </div>
      <style jsx>{`
        /* SubscriptionPlansPage.css */

        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .subscription-plan {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease-in-out;
        
          &:hover {
            transform: scale(1.02);
          }
        }
        
        .subscription-plan h3 {
          color: #333;
        }
        
        .subscription-plan ul {
          list-style: none;
          padding: 0;
        }
        
        .subscription-plan li {
          margin-bottom: 5px;
          color: #555;
        }
                
      `}</style>
    </div>
  );
};

export default SubscriptionPlansPage;
