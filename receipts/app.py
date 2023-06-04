import os

# import boto3
from dotenv import load_dotenv
from flask import Flask, request
from parse.image import ReceiptParser
from werkzeug.middleware.proxy_fix import ProxyFix

# from uuid import uuid4


load_dotenv()

app = Flask(__name__)


app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)


@app.route("/receipts", methods=["POST"])
def save_and_parse_receipt():
    receipt = request.files.get("receipt")
    if not receipt:
        return ({"error": "no file in request"}, 400)
    total = ReceiptParser(receipt).parse().get_total()
    return ({"total": total}, 200)
    # receipt_id = str(uuid4())
    # s3 = boto3.resource("s3",
    #                     aws_access_key_id=os.environ.get("AWS_ACCESS_ID"),
    #                     aws_secret_access_key=os.environ.get("AWS_ACCESS_KEY"))
    # s3.meta.client.upload_fileobj(
    #     receipt, os.environ.get("S3_BUCKET_NAME"), receipt_id)
    # return {"id": receipt_id}


def get_port():
    return int(os.environ.get("PORT", 8001))


if __name__ == "__main__":
    app.run(debug=True, port=8001, host="0.0.0.0")
