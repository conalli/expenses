.PHONY: all receipts build up-d down down-v
MAKE := make 

all:
	$(MAKE) -C ./api

receipts:
	$(MAKE) -C ./receipts

build:
	docker-compose build

up-d:
	docker-compose up --detach

down:
	docker-compose down

down-v:
	docker-compose down --volumes
