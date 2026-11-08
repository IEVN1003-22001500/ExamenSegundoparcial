from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from database import mysql
from blueprints.pizzeria.routes import pizzeria_bp

# Corrección de _name_ a __name__
app = Flask(__name__)
app.config.from_object(config['development'])

mysql.init_app(app)
CORS(app)

app.register_blueprint(pizzeria_bp)

def pagina_no_encontrada(error):
    return "<h1>Página no encontrada</h1>", 404

# Corrección de _name_ a __name__
if __name__ == '__main__':
    app.register_error_handler(404, pagina_no_encontrada)
    app.run(host='0.0.0.0', port=5000)