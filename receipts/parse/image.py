import re
from typing import Self

import pytesseract
from PIL import Image
from werkzeug import datastructures


class ReceiptParser:
    receipt_data: str = ""

    def __init__(self, file: datastructures.FileStorage, lang="jpn") -> None:
        self.file = file
        self.lang = lang

    def parse(self) -> Self:
        receipt = Image.open(self.file)
        self.receipt_data = self._parse_receipt_image(receipt)
        return self

    def _parse_receipt_image(self, receipt: Image) -> str:
        config = r'--tessdata-dir "/usr/share/tesseract-ocr/4.00/tessdata"'
        file_text: str = pytesseract.image_to_string(
            receipt, self.lang, config)
        return file_text

    def get_total(self) -> int:
        found: list[str] = re.findall(r"\d+[.,]\s*\d+\b", self.receipt_data)
        totals = [int(re.sub(r"[.,\s]", "", total))
                  for total in found]
        if len(totals) == 0:
            return 0.0
        return max(totals)
