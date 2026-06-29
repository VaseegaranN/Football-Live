import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const matchesApi = {
  getAll: (params) =>
    api.get('/matches', { params }),

  getLive: () =>
    api.get('/matches/live'),

  getById: (id) =>
    api.get(`/matches/${id}`),
};

export const playersApi = {
  getById: (id) =>
    api.get(`/players/${id}`),

  search: (q) =>
    api.get('/players/search', { params: { q } }),
};

export const leaguesApi = {
  getAll: () =>
    api.get('/leagues'),
};

export const teamsApi = {
  getById: (id) =>
    api.get(`/teams/${id}`),
};

export const worldCupApi = {
  getStandings: (leagueId = 5) =>
    api.get('/worldcup/standings', { params: { leagueId } }),

  getBracket: (leagueId = 5) =>
    api.get('/worldcup/bracket', { params: { leagueId } }),
};

export default api;
