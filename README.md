# Fitness and Wellness Gamification Platform

FitQuest is a production-ready starter web app for motivating healthy habits with points, levels, badges, streaks, daily challenges, leaderboards, and progress tracking.

## Stack

- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB when `MONGODB_URI` is configured, JSON datastore fallback when it is not
- Auth: bcrypt password hashing and JWT bearer tokens

## Features

- Signup, login, logout, and protected API routes
- Hashed passwords with `bcryptjs`
- JWT authentication middleware
- Dashboard with daily goal, points, streak, badges, level progress, leaderboard rank, weekly progress, and activity history
- Workout programs for Beginner, Intermediate, Advanced, Yoga, Cardio, and Strength training
- Start and complete workout actions
- Gamification rewards:
  - Workout completion: 50 points
  - Daily goal completion: 100 points
  - Streak bonus: 10 points per streak day, capped at 100
  - Badges: Beginner, Consistency, 7-Day Streak, 1000 Points
  - Levels: Level 1 at 0, Level 2 at 500, Level 3 at 1000, Level 4 at 2000
- Daily challenge API and completion flow
- Leaderboard ranked by points
- Profile settings for fitness level and daily activity goal
- Responsive mobile and desktop UI

## Project Structure

```text
fitness-gamification-platform
+-- frontend
|   +-- index.html
|   +-- login.html
|   +-- signup.html
|   +-- dashboard.html
|   +-- leaderboard.html
|   +-- workouts.html
|   +-- profile.html
|   +-- css
|   |   +-- styles.css
|   +-- js
|       +-- api.js
|       +-- auth.js
|       +-- dashboard.js
|       +-- workouts.js
|       +-- leaderboard.js
|       +-- profile.js
+-- backend
|   +-- server.js
|   +-- routes
|   |   +-- auth.js
|   |   +-- workouts.js
|   |   +-- leaderboard.js
|   +-- models
|   |   +-- User.js
|   |   +-- Workout.js
|   +-- middleware
|   |   +-- authMiddleware.js
|   +-- services
|   |   +-- gamification.js
|   +-- data
|       +-- challenges.js
|       +-- jsonStore.js
|       +-- mongoStore.js
|       +-- seed.js
|       +-- store.js
|       +-- workouts.js
+-- package.json
+-- README.md
```

## Run Locally

```bash
npm install
copy .env.example .env
npm start
```

Open `http://localhost:3000`.

The app works without MongoDB by storing data in `backend/data/local/db.json`. To use MongoDB, set `MONGODB_URI` in `.env` before starting the server.

## MongoDB Atlas Setup

Use your Atlas connection string only as an environment variable. Do not commit it.

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/fitness_gamification_platform?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
CLIENT_ORIGINS=http://localhost:3000
```

In Atlas, make sure your database user has read/write permissions and your deployment host IP is allowed in Network Access. For quick testing you can allow access from anywhere, but a restricted host IP is better for production.

## Deploy With GitHub

This repository is ready to push to GitHub. The frontend can deploy to GitHub Pages through `.github/workflows/pages.yml`.

GitHub Pages hosts static files only, so the Express backend still needs a Node hosting provider such as Render, Railway, Fly.io, or a VPS. A `render.yaml` and `Procfile` are included so the backend can be deployed from the same GitHub repository.

### Backend Environment Variables

Set these in your backend host dashboard:

```bash
NODE_ENV=production
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGINS=https://<your-github-username>.github.io/<your-repo-name>
```

After the backend is live, update `frontend/js/config.js`:

```js
window.FITQUEST_CONFIG = {
  API_BASE_URL: 'https://<your-backend-domain>/api'
};
```

Commit and push that change so GitHub Pages uses the deployed API.

### Deploy Backend on Vercel

The repository now includes a root-level `server.js` so Vercel can detect the Express app correctly.

1. Import the GitHub repository into Vercel.
2. Keep the project root as the repository root.
3. Add these environment variables in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CLIENT_ORIGINS=https://<your-github-username>.github.io/<your-repo-name>`
4. Deploy.
5. Test `https://<your-vercel-domain>/api/health`.

After the backend deploy succeeds, update `frontend/js/config.js` with:

```js
window.FITQUEST_CONFIG = {
  API_BASE_URL: 'https://<your-vercel-domain>/api'
};
```

### GitHub Push

```bash
git init
git add .
git commit -m "Prepare FitQuest for deployment"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
git push -u origin main
```

Then open the GitHub repository settings, enable Pages with GitHub Actions, and let the included workflow publish the `frontend` folder.

## REST API

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`

### Workouts and Challenges

- `GET /api/workouts`
- `POST /api/workouts/:id/start`
- `POST /api/workouts/:id/complete`
- `GET /api/workouts/challenges/daily`
- `POST /api/workouts/challenges/:id/complete`

### Leaderboard

- `GET /api/leaderboard`

## Production Notes

- Set a strong `JWT_SECRET`.
- Configure `MONGODB_URI` for durable multi-user persistence.
- Serve behind HTTPS in production.
- Restrict `CLIENT_ORIGIN` to the deployed frontend origin.
- Consider replacing the JSON fallback with MongoDB-only storage for horizontally scaled deployments.
