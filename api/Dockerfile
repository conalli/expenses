FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/api

RUN apt-get update && apt-get -y install gcc && apt-get -y install libpq-dev && apt-get -y install python-dev

COPY ./requirements.txt .

RUN pip install --upgrade pip
RUN python -m pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "expensemanager.wsgi"]