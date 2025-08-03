import React from 'react'

export default function ShapExplaination({shapData}){
    if(!shapData || shapData.length === 0){
        return (
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-gray-600">
        No SHAP explanation available yet.
      </div>
    );
        
    }

    return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Top Feature Contributions (SHAP)</h2>
      <div className="space-y-3">
        {shapData.map((item, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg"
          >
            <span className="font-medium text-gray-700">{item.feature}</span>
            <span 
              className={`font-semibold ${
                item.shap_value > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {item.shap_value.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );    
}