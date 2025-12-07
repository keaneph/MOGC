from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
import os

# creates Flask app & loads config

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for Next.js frontend
CORS(
	app,
	origins=[
		"http://localhost:3000",
		"https://mogc.vercel.app",
		"https://mogc.onrender.com",
	],
	supports_credentials=True,
)

# register blueprints
from app.routes.check import check_bp
from app.routes.students import students_bp
from app.routes.counselors import counselors_bp
from app.routes.availability import availability_bp
from app.routes.schedules import schedules_bp
from app.routes.event_types import event_types_bp
from app.routes.appointments import appointments_bp
from app.routes.activity import activity_bp
from app.routes.calendar import calendar_bp

app.register_blueprint(check_bp)
app.register_blueprint(students_bp)
app.register_blueprint(counselors_bp)
app.register_blueprint(availability_bp)
app.register_blueprint(schedules_bp)
app.register_blueprint(event_types_bp)
app.register_blueprint(appointments_bp)
app.register_blueprint(activity_bp)
app.register_blueprint(calendar_bp)


@app.route("/healthcheck")
def healthcheck():
    return jsonify({"status": "ok"}), 200


# pang debug lang
print("GOOGLE_CLIENT_ID:", os.getenv("GOOGLE_CLIENT_ID"))
print("GOOGLE_CLIENT_SECRET:", "***" if os.getenv("GOOGLE_CLIENT_SECRET") else "NOT SET")
print("ENCRYPTION_KEY:", "***" if os.getenv("ENCRYPTION_KEY") else "NOT SET")