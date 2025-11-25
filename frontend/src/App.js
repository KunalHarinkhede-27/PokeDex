import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import { fetchPokemon, fetchSpecies, fetchEvolution } from './api';

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (q) => {
    setLoading(true);
    setError(null);
    setPokemon(null);
    setSpecies(null);
    setEvolution(null);
    try {
      const p = await fetchPokemon(q);
      setPokemon(p.data);
      const s = await fetchSpecies(q);
      setSpecies(s.data);
      const evoUrl = s.data.evolution_chain?.url;
      if (evoUrl) {
        const parts = evoUrl.split('/').filter(Boolean);
        const id = parts[parts.length - 1];
        const e = await fetchEvolution(id);
        setEvolution(e.data);
      }
    } catch (err) {
      if (err.response?.status === 404) setError('Pokemon not found');
      else setError('Failed to fetch. Check console.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>PokeDex</h1>
        <p>Search any Pokémon by name or id. Now with species and evolution chain. Caching + Redis optional.</p>
        <SearchBar onSearch={handleSearch} />
      </header>

      <main>
        {loading && !pokemon && <div className="status">Loading…</div>}
        {error && <div className="status error">{error}</div>}
        <PokemonCard
          pokemon={pokemon}
          species={species}
          evolution={evolution}
          loading={loading}
        />
      </main>

      <footer className="footer">Built with ❤️ using MERN • Data from <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokeAPI</a></footer>
    </div>
  );
}
