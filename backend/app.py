from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, WaitlistEmail
import re
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///waitlist.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@app.route('/api/waitlist', methods=['POST'])
def add_to_waitlist():
    """Add email to waitlist"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].strip().lower()
        
        # Validate email format
        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if email already exists
        existing_email = WaitlistEmail.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new waitlist entry
        new_entry = WaitlistEmail(email=email)
        db.session.add(new_entry)
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully added to waitlist',
            'data': new_entry.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/waitlist', methods=['GET'])
def get_waitlist():
    """Get all waitlist emails (admin endpoint)"""
    try:
        emails = WaitlistEmail.query.order_by(WaitlistEmail.timestamp.desc()).all()
        return jsonify({
            'count': len(emails),
            'emails': [email.to_dict() for email in emails]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

# Create database tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
