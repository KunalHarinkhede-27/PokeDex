## PokeDex — MERN Stack Project

This repository contains a complete MERN-stack PokeDex application created as a technical challenge submission.
The project includes:

Backend (Node + Express) that fetches PokeAPI

In-memory caching to reduce API calls

Species and evolution endpoints

Admin endpoints for cache inspection and clearing

Frontend (React) with search, detailed cards, species flavor text, and evolution chain

2. Prerequisites

Before running the project, ensure you have:

Node.js v16 or higher

npm v8 or higher

3. Run the Backend
   
cd pokedex-mern/backend

npm install

node index.js


The backend will start at:

http://localhost:4000/api

4. Run the Frontend
   
cd pokedex-mern/frontend

npm install

npm start


The frontend will start at:

http://localhost:3000

5. API Endpoints
- `GET /api/pokemon/{nameOrId}`
- `GET /api/species/{nameOrId}`
- `GET /api/evolution/{id}`
- `GET /api/admin/cache/stats`
- `POST /api/admin/cache/clear`
- `GET /api/health`

