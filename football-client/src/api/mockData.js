// ============================================================================
// Football Live Scores - Frontend Mock Data Fallback
// Provides offline data when the backend API/DB is unreachable.
// ============================================================================

const getFormattedDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const mockLeagues = [
  { id: 1, name: 'Premier League', country: 'England', logo: 'https://flagcdn.com/w80/gb-eng.png' },
  { id: 2, name: 'La Liga', country: 'Spain', logo: 'https://flagcdn.com/w80/es.png' },
  { id: 3, name: 'Serie A', country: 'Italy', logo: 'https://flagcdn.com/w80/it.png' },
  { id: 4, name: 'Bundesliga', country: 'Germany', logo: 'https://flagcdn.com/w80/de.png' },
  { id: 5, name: 'FIFA World Cup 2026', country: 'USA/Canada/Mexico', logo: 'world-cup', isTournament: true, currentStage: 'Group Stage' }
];

export const mockTeams = {
  1: { id: 1, name: 'Arsenal', shortName: 'ARS', logo: 'https://flagcdn.com/w80/gb-eng.png', stadium: 'Emirates Stadium' },
  2: { id: 2, name: 'Chelsea', shortName: 'CHE', logo: 'https://flagcdn.com/w80/gb-eng.png', stadium: 'Stamford Bridge' },
  3: { id: 3, name: 'Manchester City', shortName: 'MCI', logo: 'https://flagcdn.com/w80/gb-eng.png', stadium: 'Etihad Stadium' },
  4: { id: 4, name: 'Liverpool', shortName: 'LIV', logo: 'https://flagcdn.com/w80/gb-eng.png', stadium: 'Anfield' },
  5: { id: 5, name: 'Real Madrid', shortName: 'RMA', logo: 'https://flagcdn.com/w80/es.png', stadium: 'Santiago Bernabéu' },
  6: { id: 6, name: 'Barcelona', shortName: 'BAR', logo: 'https://flagcdn.com/w80/es.png', stadium: 'Spotify Camp Nou' },
  7: { id: 7, name: 'AC Milan', shortName: 'MIL', logo: 'https://flagcdn.com/w80/it.png', stadium: 'San Siro' },
  8: { id: 8, name: 'Juventus', shortName: 'JUV', logo: 'https://flagcdn.com/w80/it.png', stadium: 'Allianz Stadium' },
  9: { id: 9, name: 'Bayern Munich', shortName: 'BAY', logo: 'https://flagcdn.com/w80/de.png', stadium: 'Allianz Arena' },
  10: { id: 10, name: 'Borussia Dortmund', shortName: 'BVB', logo: 'https://flagcdn.com/w80/de.png', stadium: 'Signal Iduna Park' },
  11: { id: 11, name: 'Argentina', shortName: 'ARG', logo: 'https://flagcdn.com/w80/ar.png', stadium: 'Estadio Azteca' },
  12: { id: 12, name: 'Poland', shortName: 'POL', logo: 'https://flagcdn.com/w80/pl.png', stadium: 'MetLife Stadium' },
  13: { id: 13, name: 'Mexico', shortName: 'MEX', logo: 'https://flagcdn.com/w80/mx.png', stadium: 'Estadio Azteca' },
  14: { id: 14, name: 'Saudi Arabia', shortName: 'KSA', logo: 'https://flagcdn.com/w80/sa.png', stadium: 'Mercedes-Benz Stadium' },
  15: { id: 15, name: 'France', shortName: 'FRA', logo: 'https://flagcdn.com/w80/fr.png', stadium: 'SoFi Stadium' },
  16: { id: 16, name: 'Denmark', shortName: 'DEN', logo: 'https://flagcdn.com/w80/dk.png', stadium: 'Hard Rock Stadium' },
  17: { id: 17, name: 'Australia', shortName: 'AUS', logo: 'https://flagcdn.com/w80/au.png', stadium: 'Lincoln Financial Field' },
  18: { id: 18, name: 'Tunisia', shortName: 'TUN', logo: 'https://flagcdn.com/w80/tn.png', stadium: 'NRG Stadium' },
  19: { id: 19, name: 'Brazil', shortName: 'BRA', logo: 'https://flagcdn.com/w80/br.png', stadium: 'MetLife Stadium' },
  20: { id: 20, name: 'Switzerland', shortName: 'SUI', logo: 'https://flagcdn.com/w80/ch.png', stadium: 'Gillette Stadium' },
  21: { id: 21, name: 'Cameroon', shortName: 'CMR', logo: 'https://flagcdn.com/w80/cm.png', stadium: 'SoFi Stadium' },
  22: { id: 22, name: 'Serbia', shortName: 'SRB', logo: 'https://flagcdn.com/w80/rs.png', stadium: 'Arrowhead Stadium' },
  23: { id: 23, name: 'Morocco', shortName: 'MAR', logo: 'https://flagcdn.com/w80/ma.png', stadium: 'Lumen Field' },
  24: { id: 24, name: 'Croatia', shortName: 'CRO', logo: 'https://flagcdn.com/w80/hr.png', stadium: 'BC Place' },
  25: { id: 25, name: 'Belgium', shortName: 'BEL', logo: 'https://flagcdn.com/w80/be.png', stadium: "Levi's Stadium" },
  26: { id: 26, name: 'Canada', shortName: 'CAN', logo: 'https://flagcdn.com/w80/ca.png', stadium: 'BMO Field' },
  27: { id: 27, name: 'Norway', shortName: 'NOR', logo: 'https://flagcdn.com/w80/no.png', stadium: 'Gillette Stadium' },
  28: { id: 28, name: 'Senegal', shortName: 'SEN', logo: 'https://flagcdn.com/w80/sn.png', stadium: 'Lincoln Financial Field' },
  29: { id: 29, name: 'Iraq', shortName: 'IRQ', logo: 'https://flagcdn.com/w80/iq.png', stadium: 'Mercedes-Benz Stadium' },
  30: { id: 30, name: 'Cabo Verde', shortName: 'CPV', logo: 'https://flagcdn.com/w80/cv.png', stadium: 'NRG Stadium' },
  31: { id: 31, name: 'Panama', shortName: 'PAN', logo: 'https://flagcdn.com/w80/pa.png', stadium: 'Hard Rock Stadium' },
  32: { id: 32, name: 'England', shortName: 'ENG', logo: 'https://flagcdn.com/w80/gb-eng.png', stadium: 'SoFi Stadium' },
  33: { id: 33, name: 'Ghana', shortName: 'GHA', logo: 'https://flagcdn.com/w80/gh.png', stadium: 'MetLife Stadium' },
  34: { id: 34, name: 'Colombia', shortName: 'COL', logo: 'https://flagcdn.com/w80/co.png', stadium: 'Lumen Field' },
  35: { id: 35, name: 'Portugal', shortName: 'POR', logo: 'https://flagcdn.com/w80/pt.png', stadium: 'BC Place' },
  36: { id: 36, name: 'DR Congo', shortName: 'COD', logo: 'https://flagcdn.com/w80/cd.png', stadium: 'BMO Field' },
  37: { id: 37, name: 'Uzbekistan', shortName: 'UZB', logo: 'https://flagcdn.com/w80/uz.png', stadium: 'Arrowhead Stadium' },
  38: { id: 38, name: 'Egypt', shortName: 'EGY', logo: 'https://flagcdn.com/w80/eg.png', stadium: 'Estadio Azteca' },
  39: { id: 39, name: 'Iran', shortName: 'IRN', logo: 'https://flagcdn.com/w80/ir.png', stadium: 'Hard Rock Stadium' },
  40: { id: 40, name: 'New Zealand', shortName: 'NZL', logo: 'https://flagcdn.com/w80/nz.png', stadium: 'MetLife Stadium' },
  41: { id: 41, name: 'South Africa', shortName: 'RSA', logo: 'https://flagcdn.com/w80/za.png', stadium: 'Mercedes-Benz Stadium' },
  42: { id: 42, name: 'South Korea', shortName: 'KOR', logo: 'https://flagcdn.com/w80/kr.png', stadium: 'SoFi Stadium' },
  43: { id: 43, name: 'Czechia', shortName: 'CZE', logo: 'https://flagcdn.com/w80/cz.png', stadium: 'Estadio Azteca' }
};

export const mockPlayers = {
  6: { id: 6, teamId: 1, name: 'Bukayo Saka', position: 'Forward', number: 7, nationality: 'England', dateOfBirth: '2001-09-05', photo: '' },
  16: { id: 16, teamId: 2, name: 'Cole Palmer', position: 'Forward', number: 20, nationality: 'England', dateOfBirth: '2002-05-06', photo: '' },
  27: { id: 27, teamId: 3, name: 'Erling Haaland', position: 'Forward', number: 9, nationality: 'Norway', dateOfBirth: '2000-07-21', photo: '' },
  35: { id: 35, teamId: 4, name: 'Mohamed Salah', position: 'Forward', number: 11, nationality: 'Egypt', dateOfBirth: '1992-06-15', photo: '' },
  47: { id: 47, teamId: 5, name: 'Kylian Mbappé', position: 'Forward', number: 9, nationality: 'France', dateOfBirth: '1998-12-20', photo: '' },
  53: { id: 53, teamId: 6, name: 'Lamine Yamal', position: 'Forward', number: 19, nationality: 'Spain', dateOfBirth: '2007-07-13', photo: '' },
  101: { id: 101, teamId: 11, name: 'Lionel Messi', position: 'Forward', number: 10, nationality: 'Argentina', dateOfBirth: '1987-06-24', photo: '' }
};

// Generates dynamic dates so matches appear on the schedule correctly
export const getMockMatchesForDate = (dateStr) => {
  const matches = [
    // Premier League matches
    {
      id: 1,
      leagueId: 1,
      league: mockLeagues[0],
      homeTeamId: 1,
      homeTeam: mockTeams[1],
      awayTeamId: 2,
      awayTeam: mockTeams[2],
      homeScore: 2,
      awayScore: 1,
      status: 'Finished',
      minute: 90,
      matchDateTime: `${dateStr}T15:00:00`,
      venue: 'Emirates Stadium',
      stage: 'Matchday 32'
    },
    {
      id: 2,
      leagueId: 1,
      league: mockLeagues[0],
      homeTeamId: 3,
      homeTeam: mockTeams[3],
      awayTeamId: 4,
      awayTeam: mockTeams[4],
      homeScore: 1,
      awayScore: 1,
      status: 'Live',
      minute: 72,
      matchDateTime: `${dateStr}T17:30:00`,
      venue: 'Etihad Stadium',
      stage: 'Matchday 32'
    },
    // La Liga
    {
      id: 3,
      leagueId: 2,
      league: mockLeagues[1],
      homeTeamId: 5,
      homeTeam: mockTeams[5],
      awayTeamId: 6,
      awayTeam: mockTeams[6],
      homeScore: 0,
      awayScore: 0,
      status: 'Upcoming',
      minute: 0,
      matchDateTime: `${dateStr}T20:00:00`,
      venue: 'Santiago Bernabéu',
      stage: 'El Clásico'
    },
    // World Cup Matches (Group Stage from Photo 1)
    {
      id: 4,
      leagueId: 5,
      league: mockLeagues[4],
      homeTeamId: 15,
      homeTeam: mockTeams[15], // France
      awayTeamId: 27,
      awayTeam: mockTeams[27], // Norway
      homeScore: 4,
      awayScore: 1,
      status: 'Finished',
      minute: 90,
      matchDateTime: `${dateStr}T12:00:00`,
      venue: 'SoFi Stadium',
      stage: 'Group Stage'
    },
    {
      id: 5,
      leagueId: 5,
      league: mockLeagues[4],
      homeTeamId: 28,
      homeTeam: mockTeams[28], // Senegal
      awayTeamId: 29,
      awayTeam: mockTeams[29], // Iraq
      homeScore: 5,
      awayScore: 0,
      status: 'Finished',
      minute: 90,
      matchDateTime: `${dateStr}T14:30:00`,
      venue: 'Lincoln Financial Field',
      stage: 'Group Stage'
    },
    {
      id: 6,
      leagueId: 5,
      league: mockLeagues[4],
      homeTeamId: 25,
      homeTeam: mockTeams[25], // Belgium
      awayTeamId: 40,
      awayTeam: mockTeams[40], // New Zealand
      homeScore: 5,
      awayScore: 1,
      status: 'Finished',
      minute: 90,
      matchDateTime: `${dateStr}T16:00:00`,
      venue: "Levi's Stadium",
      stage: 'Group Stage'
    },
    {
      id: 7,
      leagueId: 5,
      league: mockLeagues[4],
      homeTeamId: 38,
      homeTeam: mockTeams[38], // Egypt
      awayTeamId: 39,
      awayTeam: mockTeams[39], // Iran
      homeScore: 1,
      awayScore: 1,
      status: 'Finished',
      minute: 90,
      matchDateTime: `${dateStr}T19:00:00`,
      venue: 'Estadio Azteca',
      stage: 'Group Stage'
    }
  ];

  return matches;
};

export const mockLiveMatches = [
  {
    id: 2,
    leagueId: 1,
    league: mockLeagues[0],
    homeTeamId: 3,
    homeTeam: mockTeams[3],
    awayTeamId: 4,
    awayTeam: mockTeams[4],
    homeScore: 1,
    awayScore: 1,
    status: 'Live',
    minute: 72,
    matchDateTime: `${getFormattedDate()}T17:30:00`,
    venue: 'Etihad Stadium',
    stage: 'Matchday 32'
  }
];

export const mockMatchDetails = {
  1: {
    id: 1,
    league: mockLeagues[0],
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[2],
    homeScore: 2,
    awayScore: 1,
    status: 'Finished',
    minute: 90,
    matchDateTime: `${getFormattedDate()}T15:00:00`,
    venue: 'Emirates Stadium',
    stage: 'Matchday 32',
    events: [
      { id: 1, matchId: 1, type: 'Goal', minute: 18, teamId: 1, playerName: 'Bukayo Saka', detail: 'Assist by Martin Ødegaard' },
      { id: 2, matchId: 1, type: 'YellowCard', minute: 42, teamId: 2, playerName: 'Enzo Fernández', detail: 'Tactical foul' },
      { id: 3, matchId: 1, type: 'Goal', minute: 55, teamId: 2, playerName: 'Cole Palmer', detail: 'Penalty' },
      { id: 4, matchId: 1, type: 'Goal', minute: 82, teamId: 1, playerName: 'Kai Havertz', detail: 'Header from corner' }
    ],
    statistics: [
      { id: 1, matchId: 1, category: 'Shots', homeValue: '14', awayValue: '9' },
      { id: 2, matchId: 1, category: 'Shots On Target', homeValue: '6', awayValue: '3' },
      { id: 3, matchId: 1, category: 'Possession', homeValue: '58%', awayValue: '42%' },
      { id: 4, matchId: 1, category: 'Passes', homeValue: '512', awayValue: '380' },
      { id: 5, matchId: 1, category: 'Fouls', homeValue: '11', awayValue: '14' },
      { id: 6, matchId: 1, category: 'Corners', homeValue: '7', awayValue: '4' }
    ]
  },
  2: {
    id: 2,
    league: mockLeagues[0],
    homeTeam: mockTeams[3],
    awayTeam: mockTeams[4],
    homeScore: 1,
    awayScore: 1,
    status: 'Live',
    minute: 72,
    matchDateTime: `${getFormattedDate()}T17:30:00`,
    venue: 'Etihad Stadium',
    stage: 'Matchday 32',
    events: [
      { id: 10, matchId: 2, type: 'Goal', minute: 34, teamId: 3, playerName: 'Erling Haaland', detail: 'Low shot in corner' },
      { id: 11, matchId: 2, type: 'Goal', minute: 61, teamId: 4, playerName: 'Mohamed Salah', detail: 'Curled left-footed shot' }
    ],
    statistics: [
      { id: 10, matchId: 2, category: 'Shots', homeValue: '11', awayValue: '12' },
      { id: 11, matchId: 2, category: 'Shots On Target', homeValue: '5', awayValue: '6' },
      { id: 12, matchId: 2, category: 'Possession', homeValue: '51%', awayValue: '49%' },
      { id: 13, matchId: 2, category: 'Fouls', homeValue: '8', awayValue: '9' }
    ]
  }
};

export const mockStandings = [
  {
    id: 1,
    leagueId: 5,
    groupName: 'Group A',
    teamId: 11,
    team: mockTeams[11], // Argentina
    played: 3,
    won: 2,
    drawn: 1,
    lost: 0,
    goalsFor: 6,
    goalsAgainst: 2,
    points: 7
  },
  {
    id: 2,
    leagueId: 5,
    groupName: 'Group A',
    teamId: 12,
    team: mockTeams[12], // Poland
    played: 3,
    won: 1,
    drawn: 2,
    lost: 0,
    goalsFor: 4,
    goalsAgainst: 3,
    points: 5
  },
  {
    id: 3,
    leagueId: 5,
    groupName: 'Group A',
    teamId: 13,
    team: mockTeams[13], // Mexico
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    goalsFor: 3,
    goalsAgainst: 3,
    points: 4
  },
  {
    id: 4,
    leagueId: 5,
    groupName: 'Group A',
    teamId: 14,
    team: mockTeams[14], // Saudi Arabia
    played: 3,
    won: 0,
    drawn: 0,
    lost: 3,
    goalsFor: 1,
    goalsAgainst: 6,
    points: 0
  },
  {
    id: 5,
    leagueId: 5,
    groupName: 'Group B',
    teamId: 15,
    team: mockTeams[15], // France
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalsFor: 9,
    goalsAgainst: 2,
    points: 9
  },
  {
    id: 6,
    leagueId: 5,
    groupName: 'Group B',
    teamId: 16,
    team: mockTeams[16], // Denmark
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    goalsFor: 4,
    goalsAgainst: 4,
    points: 4
  },
  {
    id: 7,
    leagueId: 5,
    groupName: 'Group B',
    teamId: 17,
    team: mockTeams[17], // Australia
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    goalsFor: 3,
    goalsAgainst: 6,
    points: 3
  },
  {
    id: 8,
    leagueId: 5,
    groupName: 'Group B',
    teamId: 18,
    team: mockTeams[18], // Tunisia
    played: 3,
    won: 0,
    drawn: 1,
    lost: 2,
    goalsFor: 1,
    goalsAgainst: 5,
    points: 1
  }
];

export const mockBracket = [
  // Round of 16
  {
    id: 101,
    leagueId: 5,
    stage: 'Round of 16',
    matchDateTime: `${getFormattedDate(-2)}T18:00:00`,
    homeTeamId: 11,
    homeTeam: mockTeams[11], // Argentina
    awayTeamId: 16,
    awayTeam: mockTeams[16], // Denmark
    homeScore: 2,
    awayScore: 1,
    status: 'Finished',
    nextMatchId: 201,
    venue: 'MetLife Stadium'
  },
  {
    id: 102,
    leagueId: 5,
    stage: 'Round of 16',
    matchDateTime: `${getFormattedDate(-2)}T21:00:00`,
    homeTeamId: 15,
    homeTeam: mockTeams[15], // France
    awayTeamId: 12,
    awayTeam: mockTeams[12], // Poland
    homeScore: 3,
    awayScore: 0,
    status: 'Finished',
    nextMatchId: 201,
    venue: 'SoFi Stadium'
  },
  {
    id: 103,
    leagueId: 5,
    stage: 'Round of 16',
    matchDateTime: `${getFormattedDate(-1)}T18:00:00`,
    homeTeamId: 19,
    homeTeam: mockTeams[19], // Brazil
    awayTeamId: 24,
    awayTeam: mockTeams[24], // Croatia
    homeScore: 1,
    awayScore: 1,
    homeScorePenalties: 4,
    awayScorePenalties: 2,
    status: 'Finished',
    nextMatchId: 202,
    venue: 'Estadio Azteca'
  },
  {
    id: 104,
    leagueId: 5,
    stage: 'Round of 16',
    matchDateTime: `${getFormattedDate(-1)}T21:00:00`,
    homeTeamId: 32,
    homeTeam: mockTeams[32], // England
    awayTeamId: 23,
    awayTeam: mockTeams[23], // Morocco
    homeScore: 2,
    awayScore: 0,
    status: 'Finished',
    nextMatchId: 202,
    venue: 'Hard Rock Stadium'
  },
  // Quarter-finals
  {
    id: 201,
    leagueId: 5,
    stage: 'Quarter-finals',
    matchDateTime: `${getFormattedDate(1)}T18:00:00`,
    homeTeamId: 11,
    homeTeam: mockTeams[11], // Argentina
    awayTeamId: 15,
    awayTeam: mockTeams[15], // France
    homeScore: 0,
    awayScore: 0,
    status: 'Upcoming',
    nextMatchId: 301,
    venue: 'AT&T Stadium'
  },
  {
    id: 202,
    leagueId: 5,
    stage: 'Quarter-finals',
    matchDateTime: `${getFormattedDate(2)}T18:00:00`,
    homeTeamId: 19,
    homeTeam: mockTeams[19], // Brazil
    awayTeamId: 32,
    awayTeam: mockTeams[32], // England
    homeScore: 0,
    awayScore: 0,
    status: 'Upcoming',
    nextMatchId: 301,
    venue: 'Gillette Stadium'
  },
  // Semi-finals
  {
    id: 301,
    leagueId: 5,
    stage: 'Semi-finals',
    matchDateTime: `${getFormattedDate(4)}T20:00:00`,
    homeTeamId: null,
    homeTeam: null,
    awayTeamId: null,
    awayTeam: null,
    homeScore: 0,
    awayScore: 0,
    status: 'Upcoming',
    nextMatchId: 401,
    venue: 'Mercedes-Benz Stadium'
  },
  // Finals
  {
    id: 401,
    leagueId: 5,
    stage: 'Finals',
    matchDateTime: `${getFormattedDate(7)}T19:00:00`,
    homeTeamId: null,
    homeTeam: null,
    awayTeamId: null,
    awayTeam: null,
    homeScore: 0,
    awayScore: 0,
    status: 'Upcoming',
    nextMatchId: null,
    venue: 'MetLife Stadium'
  }
];

export const searchMockPlayers = (q) => {
  const query = q.toLowerCase().trim();
  if (!query) return [];
  return Object.values(mockPlayers).filter(p => p.name.toLowerCase().includes(query));
};
