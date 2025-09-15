# Real-Time Polling API

A **real-time polling application api** built with modern web technologies.  
It allows users to create polls, vote on options, and receive live updates when votes are submitted using **WebSocket + Redis Pub/Sub** for real-time communication.

## Tech Stack

- **Backend Framework**: Node.js, Express.js  
- **Database**: PostgreSQL with Prisma ORM  
- **Real-Time Communication**: WebSocket, Redis - Pub/Sub  
- **Language**: TypeScript 

## Setup Instructions

## With Docker

```bash
git clone https://github.com/VishalChaudhary01/real-time-polling-api.git
cd real-time-polling-api
cp .env.example .env
docker-compose up --build
```

## Manually (without docker)
### 1. Clone the Repository
```bash
  git clone https://github.com/VishalChaudhary01/real-time-polling-api.git
  cd real-time-polling-api
```

### 2. Install dependencies
```bash
  npm install
```

### 3. Configure Environment Variables
Copy .env.example to .env file
```bash
  cp .env .env.example
```
Update Environment varialbes with your values like database url

### 4. Setup the Database
Run Prisma migrations to set up the schema:
```bash
  npx prisma migrate dev
```

### 5. Start the Server
```bash
  npm run dev
```

## Testing the API

I’ve included a Postman collection to make testing easier.

### 1. Import Collection

Open Postman

Import the file: real-time-polling-api.postman_collection.json

### 2. API Flow

**1. Auth**

- POST /api/v1/auth/signup → Register a new user
- POST /api/v1/auth/signin → Sign in (uses cookie-based auth)
- POST /api/v1/auth/signout → Logout
- GET /api/v1/users/profile → Fetch logged-in user profile

**2. Polls**

- POST /api/v1/polls → Create a new poll
- GET /api/v1/polls → List all polls
- GET /api/v1/polls/:pollId → Get a single poll

**3. Voting (Real-Time)**

- POST /api/v1/polls/:pollId/vote/:optionId → Vote on a poll option

When a vote is cast, all subscribed clients will receive a WebSocket event (voteUpdated) with the updated poll results.

### 3. WebSocket Testing

Connect to WebSocket server using Postman’s WebSocket client (or wscat CLI):
```bash
  ws://localhost:3000
```

Example subscription message:
```bash
  {
    "type": "subscribe",
    "pollId": "your-poll-id"
  }
```
After voting, you should see live updates broadcasted to all subscribers.

