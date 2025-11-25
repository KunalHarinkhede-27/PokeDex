# PokeDex — Submission

This repository is an MERN project submission for the Pokedex challenge.
It includes:
- Backend (Node + Express) proxying PokeAPI with caching (in-memory)
- Species and evolution endpoints
- Admin cache endpoints (inspect/clear)
- Frontend (React) with search, detailed card, species flavor text and evolution chain

## Quick start (local)

# How to Run Locally
Prerequisites: 
Node.js v16+
npm v8+

1. 
cd pokedex-mern/backend
npm install
node index.js

2. Start frontend:
cd pokedex-mern/frontend
npm install
npm start

Frontend: http://localhost:3000  
Backend: http://localhost:4000/api


## API endpoints (examples)
- `GET /api/pokemon/{nameOrId}`
- `GET /api/species/{nameOrId}`
- `GET /api/evolution/{id}`
- `GET /api/admin/cache/stats`
- `POST /api/admin/cache/clear`
- `GET /api/health`

