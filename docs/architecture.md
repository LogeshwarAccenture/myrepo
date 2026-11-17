# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record your plan here before editing code.

- Presentation tier decision:Use the shared API client in the React frontend to call backend API endpoints and display activities, teams, leaderboard data, and workout suggestions.

- Logic tier decision:Implement Express routes according to the API contract and return deliberate 4xx errors for invalid requests.

- Data tier decision:Use Mongoose models to store and validate users, teams, and activities in MongoDB.

- Activity tracking approach:Validate userId and teamId, create activity records, calculate points, and store occurredAt timestamps.

- Team management approach:Allow team creation and listing, preserve name and mascot values, and return 400 when the team name is missing.
- Leaderboard approach:Aggregate activity points by team, sort descending by total points, and assign ranks starting at 1.
- Workout suggestions approach:Find users by email, generate recommendations from goals or recent activity, and return a 4xx response when no matching user exists.

## Test plan

Record the commands you run and what each failure means.

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend` Validates Mongoose models, relationships, and database behavior.
- API command: `npm run test:api --prefix octofit-tracker/backend` Validates API routes, request validation, error handling, and response contracts.
- Frontend command: `npm test --prefix octofit-tracker/frontend` Validates React components and frontend interaction with the API. 
- Backend build command: `npm run build --prefix octofit-tracker/backend` Ensures the TypeScript backend compiles successfully.
- Frontend build command: `npm run build --prefix octofit-tracker/frontend` Ensures the Vite React application builds successfully.
Initial baseline: 15 tests failing before implementation, indicating incomplete functionality in the starter code.
