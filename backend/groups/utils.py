from datetime import datetime
from typing import Optional

from django.http import QueryDict


class QueryParamParser:
    """ Parser for expense query params """
    group: int
    year: Optional[int]
    month: Optional[int]
    day: Optional[int]

    def __init__(self, pk: int, query_params: QueryDict):
        self.group = pk
        y, m, d = query_params.get("year"), query_params.get(
            "month"), query_params.get("day")
        self.year = int(y) if y is not None and y.isnumeric() else None
        self.month = self.month_to_int(m) if m is not None else None
        self.day = int(d) if d is not None and d.isnumeric() else None

    def month_to_int(self, month: str) -> Optional[int]:
        if month == "":
            return None
        if month.isnumeric():
            return int(month)
        try:
            if (len(month) == 3):
                return datetime.strptime(month, "%b").month
            return datetime.strptime(month, "%B").month
        except:
            return None

    def to_filter(self) -> dict[str, int]:
        filters = {"group": self.group}
        if self.year == self.month == self.day == None:
            return filters
        if self.year:
            filters["date__year"] = self.year
        if self.month:
            filters["date__month"] = self.month
        if self.day:
            filters["date__day"] = self.day
        return filters
