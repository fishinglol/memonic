from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class WaitlistEmail(db.Model):
    """Model for storing waitlist email addresses"""
    __tablename__ = 'waitlist_emails'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<WaitlistEmail {self.email}>'
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'timestamp': self.timestamp.isoformat()
        }
