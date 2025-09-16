from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import warnings
import re

warnings.filterwarnings("ignore", category=UserWarning)

from flask_cors import CORS

app = Flask(__name__)       # Initialize app FIRST
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/*": {"origins": "chrome-extension://gadokcobfhbgdmlpogmlhcpjhggpaljo"}})
# Load the trained model
model = joblib.load('spam_classifier_model.pkl')

# Text cleaning function
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text

# Inference function
def predict_spam(message):
    # Ensure message is a string, not a dict
    if isinstance(message, dict):
        message = message.get('message', '')

    if not isinstance(message, str):
        raise ValueError('Message must be a string.')

    cleaned_msg = clean_text(message)
    proba = model.predict_proba([cleaned_msg])[0]
    label = "SPAM" if proba[1] > 0.5 else "HAM"
    confidence = proba[1] if proba[1] > 0.5 else proba[0]
    spam_words = [word for word in cleaned_msg.split() if len(word) > 4]

    return {
        "result": label,
        "confidence": round(confidence * 100, 2),
        "Indicating Words": spam_words
    }


# API Endpoint
@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.get_json()
        print('Received data:', data)  # See what frontend sent
        message = data.get('message', '')

        print('Message extracted:', message)

        if not isinstance(message, str):
            return jsonify({"error": "Invalid message format"}), 400

        result = predict_spam(message)
        return jsonify(result)

    except Exception as e:
        print('Error during classification:', e)
        return jsonify({"error": "Internal server error"}), 500

# Run app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
