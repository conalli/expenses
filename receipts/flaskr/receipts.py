from flask import Blueprint, request
from parse.image import ReceiptParser

bp = Blueprint("receipts", __name__, url_prefix="/receipts")


@bp.route("", methods=["POST"])
def receipts():
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
