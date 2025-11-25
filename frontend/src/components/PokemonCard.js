import React from 'react';

function StatRow({ name, value, loading }) {
  return (
    <div className="stat-row" role="row">
      <div className="stat-name">{loading ? <div className="skeleton" style={{ width: 80 }} /> : name}</div>
      <div className="stat-value">{loading ? <div className="skeleton" style={{ width: 30 }} /> : value}</div>
    </div>
  );
}

function renderEvolutionNames(chain) {
  if (!chain) return null;
  const names = [];
  (function walk(node) {
    if (!node) return;
    names.push(node.species.name);
    if (node.evolves_to && node.evolves_to.length) {
      node.evolves_to.forEach(walk);
    }
  })(chain.chain || chain);
  return names;
}

export default function PokemonCard({ pokemon, species, evolution, loading }) {
  if (loading && !pokemon) {
    return (
      <div className="card" aria-busy="true" aria-live="polite">
        <div className="card-header">
          <h2><div className="skeleton" style={{ width: 200, height: 28 }} /></h2>
          <div className="chip"><div className="skeleton" style={{ width: 120, height: 28 }} /></div>
        </div>
        <div className="card-body">
          <div className="left">
            <div className="skeleton" style={{ width: 260, height: 260 }} />
            <div className="meta"><div className="skeleton" style={{ width: 180 }} /></div>
            <div className="abilities"><div className="skeleton" style={{ width: 220 }} /></div>
          </div>
          <div className="right">
            <h3>Stats</h3>
            <StatRow loading={true} name="" value="" />
            <StatRow loading={true} name="" value="" />
            <StatRow loading={true} name="" value="" />
            <h3>Top moves</h3>
            <div className="moves">
              <div className="skeleton" style={{ width: 80, height: 28 }} />
              <div className="skeleton" style={{ width: 80, height: 28 }} />
              <div className="skeleton" style={{ width: 80, height: 28 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  const { name, id, sprites, types = [], height, weight, stats = [], abilities = [], moves = [] } = pokemon;
  const img = sprites?.other?.['official-artwork']?.front_default || sprites?.front_default || '/assets/placeholder.png';
  const flavor = species?.flavor_text_entries?.find(e => e.language.name === 'en')?.flavor_text?.replace(/\n|\f/g, ' ') || '';
  const evoNames = evolution ? renderEvolutionNames(evolution) : null;

  return (
    <div className="card" role="region" aria-label={`Details for ${name}`}>
      <div className="card-header">
        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <h2>{name?.toUpperCase()} <span className="id">#{id}</span></h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {types.map(t => (
              <span
                key={t.type.name}
                className="type-badge"
                data-type={t.type.name}
                title={t.type.name}
                aria-label={`Type ${t.type.name}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="chip" aria-hidden>
          <strong style={{ fontWeight: 800 }}>{abilities.map(a => a.ability.name).slice(0, 2).join(' • ')}</strong>
        </div>
      </div>

      <div className="card-body">
        <div className="left">
          <img
            className="artwork"
            src={img}
            alt={`${name} official artwork`}
            loading="lazy"
            width={280}
            height={280}
          />
          <div className="meta">Height: {(height / 10).toFixed(1)} m • Weight: {(weight / 10).toFixed(1)} kg</div>
          <div className="abilities">Abilities: {abilities.map(a => a.ability.name).join(', ')}</div>
          {flavor && <div className="flavor">{flavor}</div>}
        </div>

        <div className="right">
          <h3>Stats</h3>
          {stats.map(s => <StatRow key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}

          <h3 style={{ marginTop: 12 }}>Top moves</h3>
          <div className="moves" role="list">
            {moves.slice(0, 8).map(m => <span key={m.move.name} className="move" role="listitem">{m.move.name}</span>)}
          </div>

          <h3 style={{ marginTop: 12 }}>Evolution</h3>
          <div className="evolution">
            {evoNames ? evoNames.map(n => <span key={n} className="evo" title={`View ${n}`}>{n}</span>) : <em>—</em>}
          </div>

          <h3 style={{ marginTop: 12 }}>Sprites</h3>
          <div className="sprites" aria-hidden>
            {Object.values(sprites || {}).filter(Boolean).slice(0, 8).map((s, i) => typeof s === 'string' ? (
              <img key={i} src={s} alt={`${name} sprite ${i}`} className="sprite" loading="lazy" />
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
}
