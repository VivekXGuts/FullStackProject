# FitQuest - Fitness and Wellness Gamification Platform

FitQuest is a syllabus-aligned full-stack web project for a 4th semester college submission. It combines workout logging, steps and calories tracking, streaks, badges, live leaderboards, daily challenges, and an admin panel inside a clean modular Node.js + Express + MongoDB architecture.

## Quick Links

- Repository: [FullStackProject](https://github.com/VivekXGuts/FullStackProject)
- Backend API: [Vercel Health Check](https://full-stack-project-xi-amber.vercel.app/api/health)

## 1. Project Architecture

- Frontend: HTML5, CSS3, semantic layouts, forms, Flexbox, CSS Grid, responsive design, vanilla JavaScript
- Backend: Node.js, Express.js, native `http` module, middleware, JWT auth, RBAC, Socket.IO
- Database: MongoDB with Mongoose, CRUD operations, challenge/user pagination
- Tooling: npm, Git, GitHub, ESLint, Prettier

### Syllabus Concepts Demonstrated

- HTML/CSS: semantic sections, forms, selectors, box model, Flexbox, Grid, responsive layout
- JavaScript: arrays, objects, DOM manipulation, event handling, modules-like organization, arrow functions, closures
- Advanced JS: promises, `async/await`, fetch API, event loop-friendly async flows
- Node.js: native `http.createServer`, npm modules, `EventEmitter`, callbacks through middleware/event flows
- Express: routers, GET/POST/PATCH routes, middleware, error handling, validation
- Socket.IO: live leaderboard updates and challenge notifications
- MongoDB: collections for users, workouts, challenges; CRUD and pagination
- Security: JWT authentication, role-based access control, Helmet security headers, rate limiting

## 2. Folder Structure

```text
fitness-gamification-platform
├── backend
│   ├── app.js
│   ├── server.js
│   ├── data
│   │   ├── challenges.js
│   │   ├── jsonStore.js
│   │   ├── mongoStore.js
│   │   ├── seed.js
│   │   ├── store.js
│   │   └── workouts.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── requireRole.js
│   │   └── validate.js
│   ├── models
│   │   ├── Challenge.js
│   │   ├── User.js
│   │   └── Workout.js
│   ├── routes
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── leaderboard.js
│   │   ├── tracking.js
│   │   └── workouts.js
│   └── services
│       ├── activityEvents.js
│       └── gamification.js
├── frontend
│   ├── admin.html
│   ├── dashboard.html
│   ├── index.html
│   ├── leaderboard.html
│   ├── login.html
│   ├── profile.html
│   ├── signup.html
│   ├── workouts.html
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── admin.js
│       ├── api.js
│       ├── auth.js
│       ├── config.js
│       ├── dashboard.js
│       ├── leaderboard.js
│       ├── profile.js
│       └── workouts.js
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
├── Procfile
├── render.yaml
├── server.js
└── vercel.json
```

## 3. Core Features

- User registration and login
- JWT-based authentication
- RBAC with `admin` and `user`
- Workout completion and history
- Daily steps and calories tracking
- Streak calculation and level progression
- Badges and achievements
- Daily challenge system plus admin-created challenge gallery
- Live leaderboard and challenge updates with Socket.IO
- Admin panel for users, roles, overview metrics, and challenge CRUD

## 4. MongoDB Models

### User

- `username`
- `email`
- `password`
- `role`
- `fitnessLevel`
- `points`
- `level`
- `badges`
- `streak`
- `dailyLogs`
- `completedWorkouts`
- `completedChallenges`
- `pointsHistory`
- `activityHistory`

### Workout

- `title`
- `description`
- `category`
- `duration`
- `difficulty`
- `calories`

### Challenge

- `title`
- `description`
- `points`
- `category`
- `goalType`
- `difficulty`
- `isActive`
- `createdBy`

## 5. API Routes

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`

### Fitness Tracking

- `GET /api/workouts`
- `POST /api/workouts/:id/start`
- `POST /api/workouts/:id/complete`
- `POST /api/tracking/daily-log`
- `GET /api/tracking/summary`

### Challenges and Leaderboards

- `GET /api/workouts/challenges`
- `GET /api/workouts/challenges/daily`
- `POST /api/workouts/challenges/:id/complete`
- `GET /api/leaderboard`

### Admin (RBAC Protected)

- `GET /api/admin/overview`
- `GET /api/admin/users?page=1&limit=6`
- `PATCH /api/admin/users/:id/role`
- `GET /api/admin/challenges?page=1&limit=4`
- `POST /api/admin/challenges`
- `PATCH /api/admin/challenges/:id`

## 6. Socket.IO Features

- `leaderboard:update` emitted when workouts/logs/challenges change rankings
- `challenge:completed` emitted when a user completes a challenge
- `challenge:created` emitted when an admin publishes a challenge

### Why this matters for the syllabus

This demonstrates realtime communication beyond normal REST routes and makes the project stronger in a demo presentation.

## 7. Security

- Password hashing with `bcryptjs`
- JWT authentication
- RBAC middleware for admin-only actions
- Helmet security headers
- Express rate limiting
- Config-driven CORS handling

## 8. Best Features Borrowed from Research

Inspired by Strava, Peloton, Nike Training Club, ZRX, and MyFitnessPal, this project now includes:

- Public challenge gallery
- Daily logging for steps and calories
- Live leaderboard pulse
- Admin-managed challenge publishing
- Realtime community feed updates
- Better progression and role-based management

## 9. Frontend Notes

- Uses semantic HTML and responsive CSS
- Demonstrates forms and input controls clearly
- Uses DOM manipulation and event listeners on every major page
- Uses arrays/objects to render leaderboard rows, charts, badges, and activity history
- Uses a closure in `frontend/js/api.js` for realtime channel creation

## 10. How to Run

### Install

```bash
npm install
copy .env.example .env
```

### Development

```bash
npm run dev
```

### Production-style local run

```bash
npm start
```

Open:

- `http://localhost:3000`

## 11. MongoDB Setup

Set your Atlas connection string in `.env`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/fitness_gamification_platform?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
ADMIN_CODE=fitquest-admin-demo
CLIENT_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

If `MONGODB_URI` is missing, the app falls back to JSON storage for local demos.

## 12. Admin Demo Setup

To create an admin account from the signup page:

- enter the optional **Admin access code**
- the code must match `ADMIN_CODE` in `.env`

Example:

```bash
ADMIN_CODE=fitquest-admin-demo
```

## 13. npm Commands

```bash
npm install
npm run dev
npm start
npm run seed
npm run lint
npm run format
```

## 14. GitHub Commit Structure

Suggested college-friendly commit flow:

```text
feat: scaffold frontend and backend structure
feat: add JWT authentication and MongoDB models
feat: implement workout tracking and gamification logic
feat: add leaderboard and daily challenges
feat: add admin panel with RBAC and pagination
feat: integrate Socket.IO live updates
chore: add eslint prettier and documentation
```

## 15. REPL / Node.js Viva Notes

If your faculty asks about Node REPL:

```bash
node
> 2 + 2
> const nums = [1,2,3]
> nums.map(n => n * 2)
```

If they ask where the `http` module is used:

- `backend/server.js` uses `http.createServer(app)` to wrap the Express app for Socket.IO.

If they ask where `EventEmitter` is used:

- `backend/services/activityEvents.js`
- Route handlers emit events, and the server forwards them to Socket.IO clients.

## 16. Submission Summary

This project is suitable for:

- college submission
- viva/demo presentation
- GitHub portfolio
- future expansion into a production-ready fitness SaaS
