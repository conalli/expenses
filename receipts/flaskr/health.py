from flask import Blueprint

bp = Blueprint("health", __name__, url_prefix="/health")


@bp.route("", methods=["GET"])
def health():
    return ({"status": "OK"}, 200)
