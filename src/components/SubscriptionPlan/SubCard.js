import React from 'react';

const SubscriptionPlanCard = ({ title, features }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionPlanCard;
