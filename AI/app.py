from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

# Load the trained model and preprocessor
model = joblib.load("difficulty_score_model.pkl")
preprocessor = joblib.load("preprocessor.pkl")

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def home():
    return "Difficulty Score Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse input JSON
        data = request.json

        # Extract input features
        input_features = [
            data['Distance (km)'],
            data['Fare (INR)'],
            data['Time Duration (minutes)'],
            data['Day of the Week'],
            data['Destination Booking Density']
        ]

        # Create a DataFrame for preprocessing
        input_df = pd.DataFrame([input_features], columns=[
            'Distance (km)',
            'Fare (INR)',
            'Time Duration (minutes)',
            'Day of the Week',
            'Destination Booking Density'
        ])

        # Preprocess the input
        input_preprocessed = preprocessor.transform(input_df)

        # Make prediction
        prediction = model.predict(input_preprocessed)

        # Return the result as JSON
        print(prediction[0])
        return jsonify({"predicted_difficulty_score": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
