start: build up-d celery

.PHONY: build
build:
	docker-compose build

.PHONY: up
up:
	docker-compose up
.PHONY: up-d
up-d:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: run
run:
	python manage.py runserver 0.0.0.0:8000

.PHONY: celery
celery:
	docker exec -it -d expenses_api celery -A expensemanager worker -l info	&& docker exec -it -d expenses_api celery -A expensemanager beat -l info -S django

.PHONY: celery_worker
celery_worker:
	docker exec -it expenses_api celery -A expensemanager worker -l info 

.PHONY: celery_beat
celery_beat:
	docker exec -it expenses_api celery -A expensemanager beat -l info -S django