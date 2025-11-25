require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const pokemonRoutes = require('./routes/pokemon');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(compression());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }));

app.use('/api', pokemonRoutes);

app.get('/', (req, res) => res.json({ message: 'Pokedex backend running' }));

app.listen(PORT, () => {
  console.log(`Pokedex backend listening on http://localhost:${PORT}`);
});
