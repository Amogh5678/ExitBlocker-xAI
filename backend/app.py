from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import shap
import numpy as np
#from lime.lime_tabular import LimeTabularExplainer
import os

app = Flask(__name__)
CORS(app)

# ===========================
# Load Model, Encoders & Scaler
# ===========================
with open("customer_churn_voting_tuned_shap.pkl", "rb") as f:
    model_data = pickle.load(f)

model = model_data["model"]
feature_names = model_data["features_names"]
scaler = model_data["scaler"]

with open("encoders (1).pkl", "rb") as f:
    encoders = pickle.load(f)

# Preload SHAP Explainer (using XGBoost from voting classifier)
shap_explainer = shap.TreeExplainer(model.named_estimators_["xgb"])

# Preload LIME Explainer (using training data for reference)
# You need to have X_train_smote saved as well
# with open("X_train_smote.pkl", "rb") as f:
#     X_train_smote = pickle.load(f)

# lime_explainer = LimeTabularExplainer(
#     training_data=np.array(X_train_smote),
#     feature_names=feature_names,
#     class_names=["No Churn", "Churn"],
#     mode="classification"
# )

# ===========================
# Routes
# ===========================
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "API is running"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        input_df = preprocess_input(data)

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        return jsonify({
            "prediction": "Churn" if prediction == 1 else "No Churn",
            "probability": round(float(probability), 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/explain/shap", methods=["POST"])
def explain_shap():
    try:
        data = request.json
        input_df = pd.DataFrame([data])

        for column, encoder in encoders.items():
            if column in input_df.columns:
                input_df[column] = encoder.transform(input_df[column])

        numeric_cols = ["tenure", "MonthlyCharges", "TotalCharges"]
        input_df[numeric_cols] = scaler.transform(input_df[numeric_cols])
        input_df = input_df[feature_names]

        # SHAP Explanation
        explainer = shap.TreeExplainer(model.estimators_[1])  # XGBoost from voting classifier
        shap_values = explainer.shap_values(input_df)

        # Convert SHAP values to float
        feature_importance = sorted(
            [(f, float(v)) for f, v in zip(feature_names, shap_values[0])],
            key=lambda x: abs(x[1]),
            reverse=True
        )

        top_features = [{"feature": f, "shap_value": v} for f, v in feature_importance[:5]]

        return jsonify({
            "explanation": top_features
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# @app.route("/explain/lime", methods=["POST"])
# def explain_lime():
#     try:
#         data = request.json
#         input_df = preprocess_input(data)

#         exp = lime_explainer.explain_instance(
#             data_row=input_df.iloc[0],
#             predict_fn=model.predict_proba
#         )

#         lime_explanation = [{"feature": f, "weight": w} for f, w in exp.as_list()]

#         return jsonify({"lime_explanation": lime_explanation})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# ===========================
# Helper Function
# ===========================
def preprocess_input(data):
    """Preprocess input data (encoding, scaling, column order)"""
    input_df = pd.DataFrame([data])

    # Encode categorical variables
    for column, encoder in encoders.items():
        if column in input_df.columns:
            input_df[column] = encoder.transform(input_df[column])

    # Scale numeric columns
    numeric_cols = ["tenure", "MonthlyCharges", "TotalCharges"]
    input_df[numeric_cols] = scaler.transform(input_df[numeric_cols])

    # Ensure correct column order
    input_df = input_df[feature_names]

    return input_df


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
