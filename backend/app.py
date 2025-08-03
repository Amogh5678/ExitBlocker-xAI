from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# loading model, encoders, and scaler
with open("customer_churn_voting_tuned_shap.pkl", "rb") as f:
    model_data = pickle.load(f)

model = model_data["model"]
feature_names = model_data["features_names"]
scaler = model_data["scaler"]

with open("encoders (1).pkl", "rb") as f:
    encoders = pickle.load(f)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "API is running"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        input_df = pd.DataFrame([data])

        for column, encoder in encoders.items():
            if column in input_df.columns:
                input_df[column] = encoder.transform(input_df[column])

        numeric_cols = ["tenure", "MonthlyCharges", "TotalCharges"]
        input_df[numeric_cols] = scaler.transform(input_df[numeric_cols])

        input_df = input_df[feature_names]#this is to ensure column order matches training

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]  # Probability of churn

        result = {
            "prediction": "Churn" if prediction == 1 else "No Churn",
            "probability": round(float(probability), 4)
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
