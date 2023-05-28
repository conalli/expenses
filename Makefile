.PHONY: all receipts build up-d down
MAKE := make 

all:
	$(MAKE) -C ./api

receipts:
	$(MAKE) -C ./receipts

build:
	docker-compose build

up-d:
	docker-compose up -d

down:
	docker-compose down -v
