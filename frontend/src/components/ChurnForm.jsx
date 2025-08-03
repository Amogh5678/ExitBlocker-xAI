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
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRadioGroup = (label, name, options) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <div className="flex gap-3 flex-wrap">
        {options.map((option) => (
          <label 
            key={option} 
            className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={String(formData[name]) === String(option)}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 select-none">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderNumberInput = (label, name, min = "0", step = "1") => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <input
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
        min={min}
        step={step}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Customer Churn Predictor</h1>
            <p className="text-blue-100 mt-2">Analyze customer retention probability with our advanced ML model</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                </div>
                
                {renderRadioGroup("Gender", "gender", ["Male", "Female"])}
                {renderRadioGroup("Senior Citizen", "SeniorCitizen", [0, 1])}
                {renderRadioGroup("Has Partner", "Partner", ["Yes", "No"])}
                {renderRadioGroup("Has Dependents", "Dependents", ["Yes", "No"])}
                {renderNumberInput("Tenure (months)", "tenure")}
              </div>

              {/* Service Information Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Service Information</h2>
                </div>

                {renderRadioGroup("Phone Service", "PhoneService", ["Yes", "No"])}
                {renderRadioGroup("Multiple Lines", "MultipleLines", ["Yes", "No", "No phone service"])}
                
                {renderSelect("Internet Service", "InternetService", [
                  { value: "DSL", label: "DSL" },
                  { value: "Fiber optic", label: "Fiber Optic" },
                  { value: "No", label: "No Internet Service" }
                ])}
              </div>
            </div>

            {/* Additional Services Section */}
            <div className="mt-8 space-y-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Additional Services</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup("Online Security", "OnlineSecurity", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Online Backup", "OnlineBackup", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Device Protection", "DeviceProtection", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Tech Support", "TechSupport", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Streaming TV", "StreamingTV", ["Yes", "No", "No internet service"])}
                {renderRadioGroup("Streaming Movies", "StreamingMovies", ["Yes", "No", "No internet service"])}
              </div>
            </div>

            {/* Billing Information Section */}
            <div className="mt-8 space-y-6">
              <div className="border-l-4 border-orange-500 pl-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Billing Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderNumberInput("Monthly Charges ($)", "MonthlyCharges", "0", "0.01")}
                {renderNumberInput("Total Charges ($)", "TotalCharges", "0", "0.01")}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Predict Churn Probability</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}