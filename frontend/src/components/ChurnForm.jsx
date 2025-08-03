import React, { useState } from 'react';
import AIExplanation from './AIExplanation';

const ChurnForm = () => {
  const [formData, setFormData] = useState({
    gender: '',
    SeniorCitizen: '',
    Partner: '',
    Dependents: '',
    tenure: '',
    PhoneService: '',
    MultipleLines: '',
    InternetService: '',
    OnlineSecurity: '',
    OnlineBackup: '',
    DeviceProtection: '',
    TechSupport: '',
    StreamingTV: '',
    StreamingMovies: '',
    Contract: '',
    PaperlessBilling: '',
    PaymentMethod: '',
    MonthlyCharges: '',
    TotalCharges: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [shapExplanation, setShapExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit prediction request
  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert numeric fields
      const processedData = {
        ...formData,
        SeniorCitizen: parseInt(formData.SeniorCitizen),
        tenure: parseInt(formData.tenure),
        MonthlyCharges: parseFloat(formData.MonthlyCharges),
        TotalCharges: parseFloat(formData.TotalCharges)
      };

      // Prediction API call
      const predResponse = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      });

      if (!predResponse.ok) {
        throw new Error('Prediction failed');
      }

      const predResult = await predResponse.json();
      setPrediction(predResult);

      // SHAP explanation API call
      const shapResponse = await fetch('http://localhost:5000/explain/shap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      });

      if (!shapResponse.ok) {
        throw new Error('SHAP explanation failed');
      }

      const shapResult = await shapResponse.json();
      setShapExplanation(shapResult);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      gender: '',
      SeniorCitizen: '',
      Partner: '',
      Dependents: '',
      tenure: '',
      PhoneService: '',
      MultipleLines: '',
      InternetService: '',
      OnlineSecurity: '',
      OnlineBackup: '',
      DeviceProtection: '',
      TechSupport: '',
      StreamingTV: '',
      StreamingMovies: '',
      Contract: '',
      PaperlessBilling: '',
      PaymentMethod: '',
      MonthlyCharges: '',
      TotalCharges: ''
    });
    setPrediction(null);
    setShapExplanation(null);
    setError(null);
    setActiveSection(0);
  };

  // Form sections for step navigation
  const formSections = [
    { id: 0, title: 'Personal Info', icon: '👤' },
    { id: 1, title: 'Account Details', icon: '📊' },
    { id: 2, title: 'Services', icon: '🛠️' },
    { id: 3, title: 'Billing', icon: '💳' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform rotate-12 scale-150"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            ExitBlocker AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced customer churn prediction with explainable AI insights
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-4 bg-white rounded-full p-2 shadow-lg">
              {formSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form Section - Full Width */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
            <form onSubmit={handlePredict} className="space-y-8">
              {/* Personal Information */}
              <div className={`transition-all duration-500 ${activeSection === 0 ? 'block' : 'hidden'}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'gender', label: 'Gender', options: [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }] },
                    { name: 'SeniorCitizen', label: 'Senior Citizen', options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
                    { name: 'Partner', label: 'Partner', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] },
                    { name: 'Dependents', label: 'Dependents', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] }
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        {field.label}
                      </label>
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Information */}
              <div className={`transition-all duration-500 ${activeSection === 1 ? 'block' : 'hidden'}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Tenure (months)
                    </label>
                    <input
                      type="number"
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      placeholder="e.g., 12"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Monthly Charges ($)
                    </label>
                    <input
                      type="number"
                      name="MonthlyCharges"
                      value={formData.MonthlyCharges}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      placeholder="e.g., 79.85"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Total Charges ($)
                    </label>
                    <input
                      type="number"
                      name="TotalCharges"
                      value={formData.TotalCharges}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      placeholder="e.g., 958.20"
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className={`transition-all duration-500 ${activeSection === 2 ? 'block' : 'hidden'}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🛠️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Services</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'PhoneService', label: 'Phone Service', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] },
                    { name: 'MultipleLines', label: 'Multiple Lines', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No phone service', label: 'No phone service' }] },
                    { name: 'InternetService', label: 'Internet Service', options: [{ value: 'DSL', label: 'DSL' }, { value: 'Fiber optic', label: 'Fiber optic' }, { value: 'No', label: 'No' }] },
                    { name: 'OnlineSecurity', label: 'Online Security', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No internet service', label: 'No internet service' }] },
                    { name: 'OnlineBackup', label: 'Online Backup', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No internet service', label: 'No internet service' }] },
                    { name: 'DeviceProtection', label: 'Device Protection', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No internet service', label: 'No internet service' }] },
                    { name: 'TechSupport', label: 'Tech Support', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No internet service', label: 'No internet service' }] },
                    { name: 'StreamingTV', label: 'Streaming TV', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No internet service', label: 'No internet service' }] },
                    { name: 'StreamingMovies', label: 'Streaming Movies', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }, { value: 'No internet service', label: 'No internet service' }] }
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        {field.label}
                      </label>
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      >
                        <option value="">Select</option>
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract & Billing */}
              <div className={`transition-all duration-500 ${activeSection === 3 ? 'block' : 'hidden'}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💳</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Contract & Billing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Contract', label: 'Contract', options: [{ value: 'Month-to-month', label: 'Month-to-month' }, { value: 'One year', label: 'One year' }, { value: 'Two year', label: 'Two year' }] },
                    { name: 'PaperlessBilling', label: 'Paperless Billing', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] },
                    { name: 'PaymentMethod', label: 'Payment Method', options: [{ value: 'Electronic check', label: 'Electronic check' }, { value: 'Mailed check', label: 'Mailed check' }, { value: 'Bank transfer (automatic)', label: 'Bank transfer (automatic)' }, { value: 'Credit card (automatic)', label: 'Credit card (automatic)' }] }
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        {field.label}
                      </label>
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      >
                        <option value="">Select</option>
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all duration-200"
                >
                  Previous
                </button>
                
                <div className="flex space-x-4">
                  {activeSection < 3 ? (
                    <button
                      type="button"
                      onClick={() => setActiveSection(Math.min(3, activeSection + 1))}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Predict Churn</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section - Below Form */}
        <div className="space-y-8">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 animate-shake">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prediction Result and AI Explanation Side by Side */}
          {prediction && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Prediction Result */}
              <div className={`p-6 rounded-2xl border-2 animate-fade-in-up ${
                prediction.prediction === 'Churn' 
                  ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
                  : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
              }`}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    prediction.prediction === 'Churn' ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    <span className="text-2xl text-white">
                      {prediction.prediction === 'Churn' ? '⚠️' : '✅'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Prediction Result</h3>
                  <div className={`text-3xl font-bold mb-2 ${
                    prediction.prediction === 'Churn' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {prediction.prediction}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-lg font-semibold">
                      {(prediction.probability * 100).toFixed(1)}%
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          prediction.prediction === 'Churn' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${prediction.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Explanation Component */}
              <AIExplanation shapExplanation={shapExplanation} />
            </div>
          )}

          {/* Info Card */}
          {!prediction && !error && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Ready to Predict</h3>
                <p className="text-gray-600 text-sm">
                  Fill out the form sections to get AI-powered churn prediction with detailed explanations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ChurnForm;
