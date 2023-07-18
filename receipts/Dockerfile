FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/receipts

COPY ./requirements.txt .

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install tesseract-ocr
RUN apt-get -y install tesseract-ocr-jpn

RUN pip install --upgrade pip
RUN python -m pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["gunicorn", "--bind", ":8001", "--workers", "2", "wsgi:create_app()", "&&", "celery", "-A", "expensemanager", "worker", "-l", "info", "&&", "celery", "-A", "expensemanager", "beat", "-l", "info", "-S", "django"]