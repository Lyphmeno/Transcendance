all: start

start:
	docker-compose build
	docker-compose up

stop:
	docker-compose stop

down:
	docker-compose down

delete:
	docker-compose down -v --rmi all

.PHONY: all start stop down delete
