from datetime import datetime
from django.http import QueryDict


class ExpenseQueryParamParser:
    """ Parser for expense query params """
    pk: int
    year: int
    month: int
    day: int

    def __init__(self, pk: int, query_params: QueryDict):
        y, m, d = query_params.get("year"), query_params.get(
            "month"), query_params.get("day")
        self.pk = pk
        self.year = int(y) if y is not None and y.isnumeric() else 0
        self.month = self.month_to_int(m) if m is not None else 0
        self.day = int(d) if d is not None and d.isnumeric() else 0

    def month_to_int(self, month: str) -> int:
        if month == "":
            return 0
        if month.isnumeric():
            return int(month)
        try:
            if (len(month) == 3):
                return datetime.strptime(month, "%b").month
            return datetime.strptime(month, "%B").month
        except:
            return 0

    def to_filter(self) -> dict[str, int]:
        filters = {"group": self.pk}
        if self.year == self.month == self.day == 0:
            return filters
        if self.year > 0:
            filters["date__year"] = self.year
        if self.month > 0:
            filters["date__month"] = self.month
        if self.day > 0:
            filters["date__day"] = self.day
        return filters
