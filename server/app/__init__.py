from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

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
        "https://mogc-git-bugfix-mogc-76-verc-bee40a-nearpharelle-7322s-projects.vercel.app",
	],
	supports_credentials=True,
)

# register blueprints
from app.routes.check import check_bp
from app.routes.students import students_bp
from app.routes.counselors import counselors_bp

app.register_blueprint(check_bp)
app.register_blueprint(students_bp)
app.register_blueprint(counselors_bp)


@app.route("/healthcheck")
def healthcheck():
    return jsonify({"status": "ok"}), 200
