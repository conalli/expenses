import pytesseract
from werkzeug import datastructures


def parse_image(file: datastructures.FileStorage):
    file_text = pytesseract.image_to_string(file, "jpy")
    return file_text
