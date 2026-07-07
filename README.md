# Echo of Morse

Echo of Morse is a full-stack web application for learning, practising, and competing with Morse code. The project combines guided learning, spaced repetition, real-time chat, friend management, live presence, and multiplayer decoding matches in one platform.

## What the project does

### Account and profile system

- Supports registration, login, session handling, and protected pages.
- Uses NextAuth for authentication and Prisma + PostgreSQL for persistent user data.
- Provides profile pages, profile editing, avatars, bios, learning level, and online status.
- Includes privacy policy, terms of service, and authentication error pages.

### Morse learning flow

- Offers a level-based learning path so users can progress from simpler characters to more advanced ones.
- Includes learning entry points, level lists, practice pages, audio playback, answer submission, result feedback, and progress previews.
- Tracks mastery, correct answers, wrong answers, total attempts, and review timing per character.
- Uses a spaced repetition system so correct answers push reviews further out and wrong answers bring them back sooner.
- Provides a review page that surfaces the characters the user should revisit next.

### Audio and message transformation

- Implements Morse character mapping and playback helpers for practice and game sessions.
- Lets users learn by listening to Morse rhythm and decoding it in context.
- Supports multiple message modes in chat, including plain language, language-to-Morse, and Morse-to-language.

### Friends and social features

- Supports user search, friend requests, request acceptance, friend removal, and friend remarks.
- Stores friendship state in the database so social relationships remain consistent across sessions.
- Surfaces online state on the home page, profile pages, and social views.

### Real-time chat

- Provides one-to-one conversations, message lists, message bubbles, composers, and chat mode switching.
- Keeps exactly one conversation per user pair to avoid duplicated threads.
- Delivers messages through a dedicated Socket.IO service so online users receive updates immediately.

### Notifications and system messages

- Includes a system message center for friend activity, invitations, and game events.
- Supports read/unread state, read-all actions, and multilingual message keys with parameters.
- Links invitation state changes to system messages so users can follow invite lifecycle updates.

### Online presence

- Tracks online users through Socket.IO and supports multiple tabs for the same user.
- Updates `isOnline` and `lastSeen` in the database when sockets connect or disconnect.
- Exposes current online counts and online friend state to the UI.

### Multiplayer radio competition

- Provides a competition home page, radio channel cards, online overview, received invitations, and radio lobbies.
- Ships with multiple radio channels, each with its own name, description, WPM speed, and capacity.
- Lets users join a lobby, view other users, toggle ready state, and invite friends.
- Uses lobby presence and ready queue tables as the backend source of truth for matchmaking.
- Creates game sessions from the ready queue and records each player in a session player table.
- Stores each player's correctness, completion time, and abandon status so the system can produce live rankings and final results.
- Renders the live session view, Morse stream, answer area, timer, ranking, and final ranking on the frontend.

### Invitations and matchmaking

- Implements the flow from sending a game invitation to accepting, declining, expiring, and entering the target lobby.
- Prevents duplicate pending invitations for the same user pair.
- Uses invitation notifications and socket events to keep the experience realtime.

### Internationalization

- Includes Chinese, English, and French locale files.
- Gradually centralizes navigation, learning, competition, chat, and system message text through shared i18n dictionaries.
- Keeps historical message fields while adding i18n keys and parameters for new localized content.

### Deployment and infrastructure

- Uses Next.js for the main web app and a separate Socket.IO service for realtime communication.
- Uses PostgreSQL and Prisma for relational data, migrations, and seed data.
- Includes Dockerfiles, Compose files, entrypoint scripts, and a Makefile for local and containerized execution.
- Provides Nginx and ModSecurity configuration for reverse proxying and request filtering.
- Includes Vault configuration and unseal scripts for secret management.

## Tech stack

- Frontend: Next.js 14, React 18, TypeScript, CSS Modules, Tailwind CSS
- Backend: Next.js App Router API routes, Prisma, PostgreSQL
- Realtime: Socket.IO, dedicated Node.js WebSocket service, JWT authentication
- Authentication: NextAuth, Prisma Adapter, bcryptjs, OAuth account linking
- Deployment: Docker, Docker Compose, Nginx, ModSecurity, Vault
- Testing: Node.js test runner, ts-node

## Project structure

```text
app/                         Next.js App Router pages and API routes
app/api/                     auth, learning, chat, friends, and competition endpoints
srcs/components/             page components and feature components
srcs/lib/                    auth, database, learning logic, services, and utilities
srcs/types/                  TypeScript type definitions
srcs/config/                 global configuration
prisma/                      Prisma schema, migrations, and seed scripts
ws-server/                   Socket.IO realtime service
docker/                      web, Nginx, ModSecurity, and entrypoint configuration
vault/                       local Vault configuration and scripts
scripts/                     development helper scripts
```

## Data model overview

- `User`: account data, profile, online state, learning level, and relations.
- `Letter` / `UserLetterProgress`: Morse characters and per-user learning progress.
- `Friendship`: friend requests, statuses, and remarks.
- `Conversation` / `Message`: one-to-one chat threads and messages.
- `SystemMessage`: system notifications and invitation updates.
- `GameInvitation`: invitations between friends.
- `RadioRoom`: radio channel configuration.
- `RadioLobbyPresence` / `RadioReadyQueue`: lobby presence and ready queue state.
- `RadioGameSession` / `RadioSessionPlayer`: multiplayer sessions and player results.

## Makefile usage

The Makefile wraps the common Docker Compose workflows. Run it from the `Echo_of_Morse/` directory. On systems where `podman-compose` is available, it is used automatically; otherwise the Makefile falls back to `docker compose`.

### Development

- `make dev`: start the development stack in detached mode
- `make dev-logs`: start the development stack in the foreground and stream logs
- `make down`: stop the development stack
- `make rebuild`: rebuild and restart the development stack
- `make re`: stop the development stack, remove volumes, and recreate it from scratch

### Production

- `make prod`: generate HTTPS certificates, rebuild images, and start production
- `make up`: start the production stack without rebuilding
- `make stop`: stop the production stack
- `make prod-down`: alternate target for stopping production
- `make prod-logs`: stream production logs
- `make ps`: show container status
- `make logs`: follow production logs

### Database

- `make db-init`: run Prisma migrations and seed data in the development stack
- `make seed`: run the production seed command
- `make reset-db`: reset the development database volume

### Tests

- `make test`: run the concurrent WebSocket integration test
- `make test-clean`: clean transient radio test state
- `make clean-test` or `make clean`: aliases for `make test-clean`

### Code quality and utilities

- `make typecheck`: run TypeScript type checking
- `make lint`: run ESLint
- `make check`: run both type checking and linting
- `make kill-port`: stop local processes on ports 3000, 3001, and 5432
- `make fclean`: remove containers, volumes, and related Podman state
- `make reset`: perform a full local environment reset

## Local setup

If you prefer running the tools directly:

Install dependencies:

```bash
npm install
cd ws-server && npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Run Prisma migrations and seed data:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the web app:

```bash
npm run dev
```

Start the Socket.IO service:

```bash
cd ws-server
npm start
```

Or run the full stack with Docker Compose:

```bash
docker compose up --build
```

## Available scripts

```bash
npm run dev                  # Start the Next.js development server
npm run build                # Build the production app
npm run start                # Start the production server
npm run typecheck            # Run TypeScript type checking
npm run lint                 # Run ESLint
npm run test:unit            # Run unit tests
npm run dev:clear-radio-state # Clear radio lobby state in development
```

## Current status

The project is already structured as a complete Morse learning and interaction platform: users can register, learn characters, review by memory state, add friends, chat in realtime, track online status, invite friends to radio lobbies, and join multiplayer Morse decoding games. The backend data model, realtime service, frontend pages, and deployment setup are all built around these core workflows.