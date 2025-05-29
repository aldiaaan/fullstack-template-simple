LOCAL_DOCKER_COMPOSE_CONFIG ?= docker-compose.local.yml
LOCAL_DETACHED ?= false
COMPOSE_PROJECT_NAME ?= perkeo-local

clean: 
	rm -rf docker/tmp/

services: .setup
		COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) \
		docker compose -f docker/$(LOCAL_DOCKER_COMPOSE_CONFIG) up $(if $(filter true,$(LOCAL_DETACHED)),-d)

.setup: 
	mkdir -p docker/tmp/postgres