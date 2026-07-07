# =========================
# Detect environment
# =========================

# Linux - 42 Fedora - podman
# Linux - Ubuntu - docker
# Others - docker


UNAME := $(shell uname)

ifeq ($(UNAME), Darwin)
	COMPOSE = docker compose
else ifneq ($(shell which podman-compose 2>/dev/null),)
	COMPOSE = podman-compose
else
	COMPOSE = docker compose
endif

# =========================
# Get params from .env.prod
# Only for the test. 
# =========================

TEST_BASE_URL ?= $(shell sed -n 's/^TEST_BASE_URL=//p' .env.prod | tail -n 1)
TEST_RADIO_ID ?= $(shell sed -n 's/^TEST_RADIO_ID=//p' .env.prod | tail -n 1)
TEST_USER_COUNT ?= $(shell sed -n 's/^TEST_USER_COUNT=//p' .env.prod | tail -n 1)
TEST_PASSWORD ?= $(shell sed -n 's/^TEST_PASSWORD=//p' .env.prod | tail -n 1)
TEST_TLS_REJECT_UNAUTHORIZED ?= $(shell sed -n 's/^TEST_TLS_REJECT_UNAUTHORIZED=//p' .env.prod | tail -n 1)

# =========================
# Core (Dev)
# =========================

dev:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml up -d

dev-logs:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml up

down:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml down

up:
	$(COMPOSE) --env-file .env.prod up -d

stop:
	$(COMPOSE) --env-file .env.prod down

# =========================
# Production
# =========================

prod:
	@if [ "$(UNAME)" = "Darwin" ]; then \
		HOST_IP=$$(ipconfig getifaddr en0 2>/dev/null || echo "127.0.0.1"); \
	elif grep -qi microsoft /proc/version 2>/dev/null; then \
		HOST_IP=$$(ipconfig.exe 2>/dev/null | grep -A4 "Wi-Fi\|Ethernet" | grep "IPv4" | awk '{print $$NF}' | head -1 | tr -d '\r'); \
		[ -z "$$HOST_IP" ] && HOST_IP="127.0.0.1"; \
	else \
		HOST_IP=$$(hostname -I 2>/dev/null | awk '{print $$1}'); \
		[ -z "$$HOST_IP" ] && HOST_IP="127.0.0.1"; \
	fi; \
	echo "Host IP detected: $$HOST_IP"; \
	mkdir -p certs; \
	openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem \
		-days 365 -nodes -subj "/CN=$$HOST_IP" \
		-addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:$$HOST_IP" 2>/dev/null || true; \
	chmod 644 certs/key.pem certs/cert.pem; \
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml up -d --build

prod-down:
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml down

prod-logs:
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml logs -f


# =========================
# DB Init
# =========================

db-init:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml exec web npx prisma migrate deploy
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml exec web npx prisma db seed

# =========================
# Debug
# =========================

ps:
	$(COMPOSE) --env-file .env.prod ps

logs:
	$(COMPOSE) --env-file .env.prod logs -f

seed:
	$(COMPOSE) --env-file .env.prod exec web npx prisma db seed

typecheck:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml exec web npm run typecheck

lint:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml exec web npm run lint

check: typecheck lint

# =========================
# Tests
# =========================

test:
	@$(MAKE) test-clean
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml cp scripts/dev-concurrent-users-test.js web:/tmp/dev-concurrent-users-test.js
	@status=0; \
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml exec \
		-e NODE_PATH=/app/node_modules \
		-e TEST_BASE_URL='$(TEST_BASE_URL)' \
		-e TEST_USER_COUNT='$(TEST_USER_COUNT)' \
		-e TEST_RADIO_ID='$(TEST_RADIO_ID)' \
		-e TEST_PASSWORD='$(TEST_PASSWORD)' \
		-e TEST_TLS_REJECT_UNAUTHORIZED='$(TEST_TLS_REJECT_UNAUTHORIZED)' \
		web node /tmp/dev-concurrent-users-test.js || status=$$?; \
	$(MAKE) test-clean; \
	exit $$status

test-clean:
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml cp scripts/dev-clear-radio-state.js web:/tmp/dev-clear-radio-state.js
	$(COMPOSE) --env-file .env.prod -f docker-compose.yml exec \
		-e NODE_PATH=/app/node_modules \
		web node /tmp/dev-clear-radio-state.js

clean-test: test-clean

clean: test-clean

# =========================
# Dev reset
# =========================

reset-db:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml down -v
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml up -d db

rebuild:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml up -d --build

re:
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml down -v
	$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml up -d --build

# =========================
# FULL CLEAN
# =========================

fclean:
	@$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
	@$(COMPOSE) --env-file .env.prod down -v --remove-orphans 2>/dev/null || true
	@-podman pod rm -f --all >/dev/null 2>&1 || true
	@-podman rm -af >/dev/null 2>&1 || true
	@-podman volume rm -f echo_of_morse_postgres_data echo_of_morse_vault_data >/dev/null 2>&1 || true
	-podman volume ls --filter label=io.podman.compose.project=echo_of_morse -q | xargs -r podman volume rm -f || true
	@echo "Clean done"

# =========================
# Ports (dev only helper)
# =========================

kill-port:
	fuser -k 3001/tcp || true
	fuser -k 3000/tcp || true
	fuser -k 5432/tcp || true

# =========================
# FULL RESET (SAFE + CLEAN)
# =========================

reset:
	@echo "🧨 Stopping compose..."
	-$(COMPOSE) --env-file .env.dev -f docker-compose.dev.yml down -v --remove-orphans || true
	-$(COMPOSE) --env-file .env.prod down -v --remove-orphans || true

	@echo "🧹 Killing ports..."
	-fuser -k 3000/tcp || true
	-fuser -k 3001/tcp || true
	-fuser -k 5432/tcp || true

	@echo "🧽 Cleaning podman state..."
	-podman-compose -f docker-compose.dev.yml down -v --remove-orphans || true
	-podman pod rm -f --all || true
	-podman rm -af || true
	-podman network prune -f || true
	-podman volume prune -f || true
	-podman system prune -f || true

	@echo "✨ Done. Environment is clean."

	
.PHONY: dev dev-logs down up stop ps logs seed typecheck lint check test test-clean clean-test clean rebuild re fclean kill-port reset-db reset
