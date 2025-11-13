from flask import Flask
from flask_cors import CORS
from config import Config

# creates Flask app & loads config

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for Next.js frontend
CORS(app, origins=["http://localhost:3000", "https://mogc.vercel.app"], supports_credentials=True)

# register blueprints
from app.routes.check import check_bp
from app.routes.students import students_bp
from app.routes.counselors import counselors_bp

app.register_blueprint(check_bp)
app.register_blueprint(students_bp)
app.register_blueprint(counselors_bp)
