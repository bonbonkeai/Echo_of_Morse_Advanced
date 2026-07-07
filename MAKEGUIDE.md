# Makefile Usage Guide

The Makefile lives in `Echo_of_Morse/`. Run these commands from that directory:

```bash
cd Echo_of_Morse
```

The Makefile automatically chooses `podman-compose` when available, otherwise it uses `docker compose`.

## Dev Environment

Start the development stack:

```bash
make dev
```

Show development logs in the foreground:

```bash
make dev-logs
```

Stop the development stack:

```bash
make down
```

Rebuild the development stack:

```bash
make rebuild
```

Fully recreate the development stack with fresh volumes:

```bash
make re
```

## Production Environment

Start production with HTTPS certificates and rebuild images:

```bash
make prod
```

Start production without rebuilding:

```bash
make up
```

Stop production:

```bash
make prod-down
```

Show production logs:

```bash
make prod-logs
```

Show container status:

```bash
make ps
```

Follow production logs:

```bash
make logs
```

## Database

Initialize the dev database with Prisma migrations and seed data:

```bash
make db-init
```

`make prod` already runs migrations and seed through `docker/prod-entrypoint.sh`; `make db-init` is only for manual dev initialization.

Run the production seed command:

```bash
make seed
```

Reset the dev database volume:

```bash
make reset-db
```

## Tests

Run the 5-user concurrent WebSocket test:

```bash
make test
```

This test creates independent users, logs them in, connects real WebSockets through the WAF, joins the radio lobby, marks all users ready, creates a game session, submits concurrent score updates, completes the session, and verifies socket events.

The test reads these values from `.env.prod`:

```env
TEST_BASE_URL
TEST_RADIO_ID
TEST_USER_COUNT
TEST_PASSWORD
TEST_TLS_REJECT_UNAUTHORIZED
```

Override them from the command line when needed:

```bash
make test TEST_USER_COUNT=7 TEST_RADIO_ID=02
```

Clean only transient radio test state:

```bash
make test-clean
```

Equivalent aliases:

```bash
make clean-test
make clean
```

You can also run a clean test sequence:

```bash
make clean test
```

`test-clean` removes pending game invitations, ready queue rows, lobby presences, and interrupted active radio sessions. It does not delete users or finished game history.

## Code Quality

Run TypeScript type checking:

```bash
make typecheck
```

Run ESLint:

```bash
make lint
```

Run both:

```bash
make check
```

## Utilities

Kill local development ports `3000`, `3001`, and `5432`:

```bash
make kill-port
```

Full cleanup of containers and volumes:

```bash
make fclean
```

Full reset, including containers, volumes, ports, and Podman state:

```bash
make reset
```
