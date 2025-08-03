import React from 'react';

const AIExplanation = ({ shapExplanation }) => {
  if (!shapExplanation) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl animate-fade-in-up">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-lg">🧠</span>
        </div>
        <h3 className="text-lg font-bold">AI Explanation</h3>
      </div>
      
      <div className="space-y-3">
        {shapExplanation.explanation.map((item, index) => (
          <FeatureCard key={index} item={item} index={index} />
        ))}
      </div>
      
      <InfoCard />
    </div>
  );
};

const FeatureCard = ({ item, index }) => {
  const isPositive = item.shap_value >= 0;
  const impactPercentage = Math.min(Math.abs(item.shap_value) * 100, 100);
  
  return (
    <div className="bg-white rounded-xl p-4 border hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700 text-sm">{item.feature}</span>
        <div className="flex items-center space-x-2">
          <ImpactBadge isPositive={isPositive} />
          <span className={`font-mono text-sm font-bold ${
            isPositive ? 'text-red-600' : 'text-green-600'
          }`}>
            {isPositive ? '+' : ''}{item.shap_value.toFixed(3)}
          </span>
        </div>
      </div>
      
      <ImpactBar isPositive={isPositive} percentage={impactPercentage} />
    </div>
  );
};

const ImpactBadge = ({ isPositive }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${
    isPositive 
      ? 'bg-red-100 text-red-700' 
      : 'bg-green-100 text-green-700'
  }`}>
    {isPositive ? 'Increases Risk' : 'Reduces Risk'}
  </span>
);

const ImpactBar = ({ isPositive, percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
    <div 
      className={`h-2 rounded-full transition-all duration-700 ${
        isPositive ? 'bg-red-400' : 'bg-green-400'
      }`}
      style={{ 
        width: `${percentage}%`,
        maxWidth: '100%'
      }}
    />
  </div>
);

const InfoCard = () => (
  <div className="mt-4 p-3 bg-blue-50 rounded-xl">
    <p className="text-xs text-blue-700 font-medium">
      💡 These factors most influence the prediction. Positive values increase churn risk, negative values decrease it.
    </p>
  </div>
);

export default AIExplanation;
