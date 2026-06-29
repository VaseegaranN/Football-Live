import axios from 'axios';
import { 
  mockLeagues, 
  mockTeams, 
  mockPlayers, 
  getMockMatchesForDate, 
  mockLiveMatches, 
  mockMatchDetails, 
  mockStandings, 
  mockBracket, 
  searchMockPlayers 
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Helper to fallback to mock data on network error or HTTP error
const withFallback = async (promise, fallbackValue) => {
  try {
    return await promise;
  } catch (err) {
    console.warn('API request failed, falling back to mock data:', err.message);
    return { data: typeof fallbackValue === 'function' ? fallbackValue() : fallbackValue };
  }
};

export const matchesApi = {
  getAll: (params) =>
    withFallback(
      api.get('/matches', { params }),
      () => getMockMatchesForDate(params?.date || new Date().toISOString().split('T')[0])
    ),

  getLive: () =>
    withFallback(api.get('/matches/live'), mockLiveMatches),

  getById: (id) =>
    withFallback(api.get(`/matches/${id}`), () => mockMatchDetails[id] || mockMatchDetails[1]),
};

export const playersApi = {
  getById: (id) =>
    withFallback(api.get(`/players/${id}`), () => mockPlayers[id] || mockPlayers[6]),

  search: (q) =>
    withFallback(api.get('/players/search', { params: { q } }), () => searchMockPlayers(q)),
};

export const leaguesApi = {
  getAll: () =>
    withFallback(api.get('/leagues'), mockLeagues),
};

export const teamsApi = {
  getById: (id) =>
    withFallback(api.get(`/teams/${id}`), () => mockTeams[id] || mockTeams[1]),
};

export const worldCupApi = {
  getStandings: (leagueId = 5) =>
    withFallback(api.get('/worldcup/standings', { params: { leagueId } }), mockStandings),

  getBracket: (leagueId = 5) =>
    withFallback(api.get('/worldcup/bracket', { params: { leagueId } }), mockBracket),
};

export default api;
