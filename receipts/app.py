import os

from dotenv import load_dotenv
from flaskr import create_app
from werkzeug.middleware.proxy_fix import ProxyFix

load_dotenv()

app = create_app()

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)


def get_port():
    return int(os.environ.get("PORT", 8001))


if __name__ == "__main__":
    app.run(debug=True, port=get_port(), host="0.0.0.0")
