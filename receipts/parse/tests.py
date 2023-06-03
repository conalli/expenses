from pathlib import Path

import pytest
from werkzeug import datastructures

from .image import ReceiptParser


@pytest.mark.parametrize("file,expected", [("../testdata/seiyu_receipt.jpg", 4457)])
def test_returns_correct_total(file: str, expected: int) -> None:
    base_path = Path(__file__).parent
    file = (base_path / file).resolve()
    with open(file, "rb") as f:
        fs = datastructures.FileStorage(f)
        parser = ReceiptParser(fs)
        assert parser.parse().get_total_int() == expected
