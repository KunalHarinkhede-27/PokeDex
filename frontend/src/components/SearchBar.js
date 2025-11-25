import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    onSearch(trimmed.toLowerCase());
  };

  return (
    <form className="searchbar" onSubmit={submit} role="search" aria-label="Search Pokemon">
      <input
        placeholder="Search Pokémon by name or id (e.g. pikachu or 25)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="pokemon-search"
        autoComplete="off"
      />
      <button type="submit" aria-label="Search">Search</button>
    </form>
  );
}
