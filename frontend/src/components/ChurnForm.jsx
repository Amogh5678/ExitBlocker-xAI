import { useState } from "react";

export default function ChurnForm({ onResult }) {
  const [formData, setFormData] = useState({
    gender: "Female",
    SeniorCitizen: 0,
    Partner: "Yes",
    Dependents: "No",
    tenure: 1,
    PhoneService: "No",
    MultipleLines: "No phone service",
    InternetService: "DSL",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    MonthlyCharges: 29.85,
    TotalCharges: 29.85,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [shapData, setShapData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      onResult(data);

      // Get SHAP Explanation
      const shapRes = await fetch("http://127.0.0.1:5000/explain/shap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const shapResult = await shapRes.json();
      setShapData(shapResult.explanation || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRadioGroup = (label, name, options) => (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-900 mb-3">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <label 
            key={option} 
            className={`
              flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-full border-2 transition-all duration-300 select-none text-sm font-medium
              ${String(formData[name]) === String(option) 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 text-white shadow-lg transform scale-105' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md hover:bg-blue-50'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={String(formData[name]) === String(option)}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="relative">
              {String(formData[name]) === String(option) && (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-900">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-700 font-medium appearance-none cursor-pointer hover:border-blue-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderNumberInput = (label, name, min = "0", step = "1") => (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-900">{label}</label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-700 font-medium hover:border-blue-300"
          min={min}
          step={step}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Customer Churn Predictor</h1>
                  <p className="text-blue-100 text-lg">Analyze customer retention probability with advanced machine learning</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Real-time Predictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <span>SHAP Explanations</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Personal Information Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>
                
                <div className="space-y-6">
                  {renderRadioGroup("Gender", "gender", ["Male", "Female"])}
                  {renderRadioGroup("Senior Citizen", "SeniorCitizen", [0, 1])}
                  {renderRadioGroup("Has Partner", "Partner", ["Yes", "No"])}
                  {renderRadioGroup("Has Dependents", "Dependents", ["Yes", "No"])}
                  {renderNumberInput("Tenure (months)", "tenure")}
                </div>
              </div>

              {/* Service Information Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-green-100">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Service Information</h2>
                </div>

                <div className="space-y-6">
                  {renderRadioGroup("Phone Service", "PhoneService", ["Yes", "No"])}
                  {renderRadioGroup("Multiple Lines", "MultipleLines", ["Yes", "No", "No phone service"])}
                  
                  {renderSelect("Internet Service", "InternetService", [
                    { value: "DSL", label: "DSL" },
                    { value: "Fiber optic", label: "Fiber Optic" },
                    { value: "No", label: "No Internet Service" }
                  ])}
                </div>
              </div>
            </div>

            {/* Additional Services Section */}
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-purple-100">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Additional Services</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderRadioGroup("Online Security", "OnlineSecurity", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Online Backup", "OnlineBackup", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Device Protection", "DeviceProtection", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Tech Support", "TechSupport", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Streaming TV", "StreamingTV", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Streaming Movies", "StreamingMovies", ["Yes", "No", "No internet service"])}
              </div>
            </div>

            {/* Billing Information Section */}
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-100">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Billing Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderSelect("Contract Type", "Contract", [
                  { value: "Month-to-month", label: "Month-to-Month" },
                  { value: "One year", label: "One Year" },
                  { value: "Two year", label: "Two Year" }
                ])}

                {renderSelect("Payment Method", "PaymentMethod", [
                  { value: "Electronic check", label: "Electronic Check" },
                  { value: "Mailed check", label: "Mailed Check" },
                  { value: "Bank transfer (automatic)", label: "Bank Transfer (Auto)" },
                  { value: "Credit card (automatic)", label: "Credit Card (Auto)" }
                ])}

                <div className="md:col-span-2 lg:col-span-1">
                  {renderRadioGroup("Paperless Billing", "PaperlessBilling", ["Yes", "No"])}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderNumberInput("Monthly Charges ($)", "MonthlyCharges", "0", "0.01")}
                {renderNumberInput("Total Charges ($)", "TotalCharges", "0", "0.01")}
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg">Analyzing Customer Data...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-lg">Predict Churn Probability</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced SHAP Explanation */}
        {shapData.length > 0 && (
          <div className="mt-10 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Feature Impact Analysis (SHAP)</h2>
            </div>
            
            <p className="text-gray-600 mb-6 text-sm">
              This analysis shows how each feature contributes to the churn prediction. 
              <span className="text-red-600 font-semibold"> Positive values </span> increase churn probability, 
              <span className="text-green-600 font-semibold"> negative values </span> decrease it.
            </p>
            
            <div className="space-y-4">
              {shapData
                .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
                .map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-800 text-lg">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        {item.shap_value > 0 ? (
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span
                          className={`font-bold text-lg px-3 py-1 rounded-full ${
                            item.shap_value > 0 
                              ? "text-red-700 bg-red-100" 
                              : "text-green-700 bg-green-100"
                          }`}
                        >
                          {(item.shap_value || 0).toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          item.shap_value > 0 
                            ? "bg-gradient-to-r from-red-400 to-red-600" 
                            : "bg-gradient-to-r from-green-400 to-green-600"
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(item.shap_value) * 200, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
