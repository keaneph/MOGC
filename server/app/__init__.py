from flask import Flask
from config import Config

# creates Flask app & loads config

app = Flask(__name__)
app.config.from_object(Config)

# register blueprints
from app.routes.check import check_bp
app.register_blueprint(check_bp)