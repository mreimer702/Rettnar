import os
from app import create_app
from app.models import db

# Get configuration name from environment, default to 'development'
config_name = os.environ.get('FLASK_CONFIG', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    with app.app_context():
        try:
            # Create all database tables
            db.create_all()
            print(f"✅ Database tables created successfully using {config_name} configuration")
            print(f"📊 Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
    
    print(f"🚀 Starting Flask app on http://localhost:5001")
    print(f"⚙️  Configuration: {config_name}")
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=5001)