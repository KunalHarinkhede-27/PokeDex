import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';
export async function fetchPokemon(identifier){
    return (await axios.get(`${API_BASE}/pokemon/${encodeURIComponent(identifier)}`)).data;
}
export async function fetchSpecies(identifier){ 
    return (await axios.get(`${API_BASE}/species/${encodeURIComponent(identifier)}`)).data; 
}
export async function fetchEvolution(id){ 
    return (await axios.get(`${API_BASE}/evolution/${encodeURIComponent(id)}`)).data; 
}
