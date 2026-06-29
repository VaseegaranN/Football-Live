-- ============================================================================
-- Football Live Scores - Seed Data
-- Realistic football data for demonstration
-- ============================================================================

USE [FootballLiveScores];
GO

-- ─── Leagues ────────────────────────────────────────────────────────────────────
SET IDENTITY_INSERT [dbo].[Leagues] ON;
INSERT INTO [dbo].[Leagues] ([Id], [Name], [Country], [Logo]) VALUES
(1, N'Premier League', N'England', N'https://flagcdn.com/w80/gb-eng.png'),
(2, N'La Liga', N'Spain', N'https://flagcdn.com/w80/es.png'),
(3, N'Serie A', N'Italy', N'https://flagcdn.com/w80/it.png'),
(4, N'Bundesliga', N'Germany', N'https://flagcdn.com/w80/de.png');
SET IDENTITY_INSERT [dbo].[Leagues] OFF;
GO

-- ─── Teams ──────────────────────────────────────────────────────────────────────
SET IDENTITY_INSERT [dbo].[Teams] ON;
INSERT INTO [dbo].[Teams] ([Id], [LeagueId], [Name], [ShortName], [Logo], [Stadium]) VALUES
(1, 1, N'Arsenal',         N'ARS', N'https://flagcdn.com/w80/gb-eng.png', N'Emirates Stadium'),
(2, 1, N'Chelsea',         N'CHE', N'https://flagcdn.com/w80/gb-eng.png', N'Stamford Bridge'),
(3, 1, N'Manchester City', N'MCI', N'https://flagcdn.com/w80/gb-eng.png', N'Etihad Stadium'),
(4, 1, N'Liverpool',       N'LIV', N'https://flagcdn.com/w80/gb-eng.png', N'Anfield'),
(5, 2, N'Real Madrid',     N'RMA', N'https://flagcdn.com/w80/es.png',     N'Santiago Bernabéu'),
(6, 2, N'Barcelona',       N'BAR', N'https://flagcdn.com/w80/es.png',     N'Spotify Camp Nou'),
(7, 3, N'AC Milan',        N'MIL', N'https://flagcdn.com/w80/it.png',     N'San Siro'),
(8, 3, N'Juventus',        N'JUV', N'https://flagcdn.com/w80/it.png',     N'Allianz Stadium'),
(9, 4, N'Bayern Munich',   N'BAY', N'https://flagcdn.com/w80/de.png',     N'Allianz Arena'),
(10, 4, N'Borussia Dortmund', N'BVB', N'https://flagcdn.com/w80/de.png',     N'Signal Iduna Park');
SET IDENTITY_INSERT [dbo].[Teams] OFF;
GO

-- ─── Players ────────────────────────────────────────────────────────────────────
SET IDENTITY_INSERT [dbo].[Players] ON;

-- Arsenal (TeamId: 1)
INSERT INTO [dbo].[Players] ([Id],[TeamId],[Name],[Position],[Number],[Nationality],[DateOfBirth]) VALUES
(1,  1, N'David Raya',          N'Goalkeeper',  13, N'Spain',       '1995-09-15'),
(2,  1, N'William Saliba',      N'Defender',    2,  N'France',      '2001-03-24'),
(3,  1, N'Gabriel Magalhães',   N'Defender',    6,  N'Brazil',      '1997-12-19'),
(4,  1, N'Declan Rice',         N'Midfielder',  41, N'England',     '1999-01-14'),
(5,  1, N'Martin Ødegaard',     N'Midfielder',  8,  N'Norway',      '1998-12-17'),
(6,  1, N'Bukayo Saka',         N'Forward',     7,  N'England',     '2001-09-05'),
(7,  1, N'Kai Havertz',         N'Forward',     29, N'Germany',     '1999-06-11'),
(8,  1, N'Ben White',           N'Defender',    4,  N'England',     '1997-10-08'),
(9,  1, N'Jurriën Timber',      N'Defender',    12, N'Netherlands', '2001-06-01'),
(10, 1, N'Leandro Trossard',    N'Forward',     19, N'Belgium',     '1994-12-04'),

-- Chelsea (TeamId: 2)
(11, 2, N'Robert Sánchez',      N'Goalkeeper',  1,  N'Spain',       '1997-11-18'),
(12, 2, N'Reece James',         N'Defender',    24, N'England',     '1999-12-08'),
(13, 2, N'Wesley Fofana',       N'Defender',    33, N'France',      '2000-12-17'),
(14, 2, N'Moisés Caicedo',      N'Midfielder',  25, N'Ecuador',     '2001-11-02'),
(15, 2, N'Enzo Fernández',      N'Midfielder',  8,  N'Argentina',   '2001-01-17'),
(16, 2, N'Cole Palmer',         N'Forward',     20, N'England',     '2002-05-06'),
(17, 2, N'Nicolas Jackson',     N'Forward',     15, N'Senegal',     '2001-06-20'),
(18, 2, N'Levi Colwill',        N'Defender',    26, N'England',     '2003-02-26'),
(19, 2, N'Noni Madueke',        N'Forward',     11, N'England',     '2002-03-10'),
(20, 2, N'Romeo Lavia',         N'Midfielder',  45, N'Belgium',     '2004-01-06'),

-- Manchester City (TeamId: 3)
(21, 3, N'Ederson',             N'Goalkeeper',  31, N'Brazil',      '1993-08-17'),
(22, 3, N'Rúben Dias',          N'Defender',    3,  N'Portugal',    '1997-05-14'),
(23, 3, N'Kyle Walker',         N'Defender',    2,  N'England',     '1990-05-28'),
(24, 3, N'Rodri',               N'Midfielder',  16, N'Spain',       '1996-06-22'),
(25, 3, N'Kevin De Bruyne',     N'Midfielder',  17, N'Belgium',     '1991-06-28'),
(26, 3, N'Phil Foden',          N'Forward',     47, N'England',     '2000-05-28'),
(27, 3, N'Erling Haaland',      N'Forward',     9,  N'Norway',      '2000-07-21'),
(28, 3, N'Bernardo Silva',      N'Midfielder',  20, N'Portugal',    '1994-08-10'),
(29, 3, N'Jack Grealish',       N'Forward',     10, N'England',     '1995-09-10'),
(30, 3, N'John Stones',         N'Defender',    5,  N'England',     '1994-05-28'),

-- Liverpool (TeamId: 4)
(31, 4, N'Alisson Becker',      N'Goalkeeper',  1,  N'Brazil',      '1992-10-02'),
(32, 4, N'Virgil van Dijk',     N'Defender',    4,  N'Netherlands', '1991-07-08'),
(33, 4, N'Trent Alexander-Arnold', N'Defender', 66, N'England',     '1998-10-07'),
(34, 4, N'Alexis Mac Allister', N'Midfielder',  10, N'Argentina',   '1998-12-24'),
(35, 4, N'Mohamed Salah',       N'Forward',     11, N'Egypt',       '1992-06-15'),
(36, 4, N'Luis Díaz',           N'Forward',     7,  N'Colombia',    '1997-01-13'),
(37, 4, N'Darwin Núñez',        N'Forward',     9,  N'Uruguay',     '1999-06-24'),
(38, 4, N'Dominik Szoboszlai',  N'Midfielder',  8,  N'Hungary',     '2000-10-25'),
(39, 4, N'Andy Robertson',      N'Defender',    26, N'Scotland',    '1994-03-11'),
(40, 4, N'Ryan Gravenberch',    N'Midfielder',  38, N'Netherlands', '2002-05-16'),

-- Real Madrid (TeamId: 5)
(41, 5, N'Thibaut Courtois',    N'Goalkeeper',  1,  N'Belgium',     '1992-05-11'),
(42, 5, N'Dani Carvajal',       N'Defender',    2,  N'Spain',       '1992-01-11'),
(43, 5, N'Éder Militão',        N'Defender',    3,  N'Brazil',      '1998-01-18'),
(44, 5, N'Luka Modrić',         N'Midfielder',  10, N'Croatia',     '1985-09-09'),
(45, 5, N'Jude Bellingham',     N'Midfielder',  5,  N'England',     '2003-06-29'),
(46, 5, N'Vinícius Júnior',     N'Forward',     7,  N'Brazil',      '2000-07-12'),
(47, 5, N'Kylian Mbappé',       N'Forward',     9,  N'France',      '1998-12-20'),
(48, 5, N'Federico Valverde',   N'Midfielder',  8,  N'Uruguay',     '1998-07-22'),
(49, 5, N'Antonio Rüdiger',     N'Defender',    22, N'Germany',     '1993-03-03'),
(50, 5, N'Rodrygo',             N'Forward',     11, N'Brazil',      '2001-01-09'),

-- Barcelona (TeamId: 6)
(51, 6, N'Marc-André ter Stegen', N'Goalkeeper', 1, N'Germany',     '1992-04-30'),
(52, 6, N'Ronald Araújo',       N'Defender',    4,  N'Uruguay',     '1999-03-07'),
(53, 6, N'Jules Koundé',        N'Defender',    23, N'France',      '1998-11-12'),
(54, 6, N'Pedri',               N'Midfielder',  8,  N'Spain',       '2002-11-25'),
(55, 6, N'Gavi',                N'Midfielder',  6,  N'Spain',       '2004-08-05'),
(56, 6, N'Robert Lewandowski',  N'Forward',     9,  N'Poland',      '1988-08-21'),
(57, 6, N'Lamine Yamal',        N'Forward',     19, N'Spain',       '2007-07-13'),
(58, 6, N'Raphinha',            N'Forward',     11, N'Brazil',      '1996-12-14'),
(59, 6, N'Frenkie de Jong',     N'Midfielder',  21, N'Netherlands', '1997-05-12'),
(60, 6, N'Alejandro Balde',     N'Defender',    3,  N'Spain',       '2003-10-18'),

-- AC Milan (TeamId: 7)
(61, 7, N'Mike Maignan',        N'Goalkeeper',  16, N'France',      '1995-07-03'),
(62, 7, N'Fikayo Tomori',       N'Defender',    23, N'England',     '1997-12-19'),
(63, 7, N'Theo Hernández',      N'Defender',    19, N'France',      '1997-10-06'),
(64, 7, N'Tijjani Reijnders',   N'Midfielder',  14, N'Netherlands', '1998-07-29'),
(65, 7, N'Christian Pulisic',   N'Forward',     11, N'United States','1998-09-18'),
(66, 7, N'Rafael Leão',         N'Forward',     10, N'Portugal',    '1999-06-10'),
(67, 7, N'Olivier Giroud',      N'Forward',     9,  N'France',      '1986-09-30'),
(68, 7, N'Ruben Loftus-Cheek',  N'Midfielder',  8,  N'England',     '1996-01-23'),
(69, 7, N'Davide Calabria',     N'Defender',    2,  N'Italy',       '1996-12-06'),
(70, 7, N'Malick Thiaw',        N'Defender',    28, N'Germany',     '2001-08-08'),

-- Juventus (TeamId: 8)
(71, 8, N'Wojciech Szczęsny',   N'Goalkeeper',  1,  N'Poland',      '1990-04-18'),
(72, 8, N'Gleison Bremer',      N'Defender',    3,  N'Brazil',      '1997-03-18'),
(73, 8, N'Federico Chiesa',     N'Forward',     7,  N'Italy',       '1997-10-25'),
(74, 8, N'Dušan Vlahović',      N'Forward',     9,  N'Serbia',      '2000-01-28'),
(75, 8, N'Manuel Locatelli',    N'Midfielder',  5,  N'Italy',       '1998-01-08'),
(76, 8, N'Adrien Rabiot',       N'Midfielder',  25, N'France',      '1995-04-03'),
(77, 8, N'Andrea Cambiaso',     N'Defender',    27, N'Italy',       '2000-02-20'),
(78, 8, N'Timothy Weah',        N'Forward',     22, N'United States','2000-02-22'),
(79, 8, N'Danilo',              N'Defender',    6,  N'Brazil',      '1991-07-15'),
(80, 8, N'Nicolò Fagioli',      N'Midfielder',  44, N'Italy',       '2001-02-12'),

-- Bayern Munich (TeamId: 9)
(81, 9, N'Manuel Neuer',        N'Goalkeeper',  1,  N'Germany',     '1986-03-27'),
(82, 9, N'Dayot Upamecano',     N'Defender',    2,  N'France',      '1998-10-27'),
(83, 9, N'Joshua Kimmich',      N'Midfielder',  6,  N'Germany',     '1995-02-08'),
(84, 9, N'Jamal Musiala',       N'Midfielder',  42, N'Germany',     '2003-02-26'),
(85, 9, N'Leroy Sané',          N'Forward',     10, N'Germany',     '1996-01-11'),
(86, 9, N'Harry Kane',          N'Forward',     9,  N'England',     '1993-07-28'),
(87, 9, N'Thomas Müller',       N'Forward',     25, N'Germany',     '1989-09-13'),
(88, 9, N'Leon Goretzka',       N'Midfielder',  8,  N'Germany',     '1995-02-06'),
(89, 9, N'Alphonso Davies',     N'Defender',    19, N'Canada',      '2000-11-02'),
(90, 9, N'Serge Gnabry',        N'Forward',     7,  N'Germany',     '1995-07-14'),

-- Borussia Dortmund (TeamId: 10)
(91,  10, N'Gregor Kobel',       N'Goalkeeper',  1,  N'Switzerland', '1997-12-06'),
(92,  10, N'Mats Hummels',       N'Defender',    15, N'Germany',     '1988-12-16'),
(93,  10, N'Nico Schlotterbeck', N'Defender',    4,  N'Germany',     '1999-12-01'),
(94,  10, N'Marcel Sabitzer',    N'Midfielder',  20, N'Austria',     '1994-03-17'),
(95,  10, N'Julian Brandt',      N'Midfielder',  10, N'Germany',     '1996-05-02'),
(96,  10, N'Marco Reus',         N'Forward',     11, N'Germany',     '1989-05-31'),
(97,  10, N'Karim Adeyemi',      N'Forward',     27, N'Germany',     '2002-01-18'),
(98,  10, N'Donyell Malen',      N'Forward',     21, N'Netherlands', '1999-01-19'),
(99,  10, N'Emre Can',           N'Midfielder',  23, N'Germany',     '1994-01-12'),
(100, 10, N'Ian Maatsen',        N'Defender',    22, N'Netherlands', '2002-03-10');

SET IDENTITY_INSERT [dbo].[Players] OFF;
GO

-- ─── Matches ────────────────────────────────────────────────────────────────────
-- Using relative dates: today = the day the seed runs
DECLARE @Today DATE = CAST(GETDATE() AS DATE);

SET IDENTITY_INSERT [dbo].[Matches] ON;

-- LIVE matches (3)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue]) VALUES
(1, 1, 1, 2, DATEADD(MINUTE, -67, GETDATE()), 'Live', 2, 1, 67, N'Emirates Stadium'),
(2, 2, 5, 6, DATEADD(MINUTE, -34, GETDATE()), 'Live', 1, 1, 34, N'Santiago Bernabéu'),
(3, 4, 9, 10, DATEADD(MINUTE, -82, GETDATE()), 'Live', 3, 2, 82, N'Allianz Arena');

-- FINISHED matches (4)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue]) VALUES
(4, 1, 3, 4, DATEADD(DAY, -1, @Today), 'Finished', 2, 2, 90, N'Etihad Stadium'),
(5, 2, 6, 5, DATEADD(DAY, -2, @Today), 'Finished', 3, 1, 90, N'Spotify Camp Nou'),
(6, 3, 7, 8, DATEADD(DAY, -3, @Today), 'Finished', 1, 0, 90, N'San Siro'),
(7, 1, 2, 3, DATEADD(DAY, -4, @Today), 'Finished', 0, 2, 90, N'Stamford Bridge');

-- UPCOMING matches (5)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue]) VALUES
(8,  1, 4, 1, DATEADD(DAY, 1, @Today), 'Upcoming', 0, 0, NULL, N'Anfield'),
(9,  2, 5, 6, DATEADD(DAY, 2, @Today), 'Upcoming', 0, 0, NULL, N'Santiago Bernabéu'),
(10, 3, 8, 7, DATEADD(DAY, 3, @Today), 'Upcoming', 0, 0, NULL, N'Allianz Stadium'),
(11, 4, 10, 9, DATEADD(DAY, 4, @Today), 'Upcoming', 0, 0, NULL, N'Signal Iduna Park'),
(12, 1, 1, 3, DATEADD(DAY, 7, @Today), 'Upcoming', 0, 0, NULL, N'Emirates Stadium');

SET IDENTITY_INSERT [dbo].[Matches] OFF;
GO

-- ─── Match Statistics ───────────────────────────────────────────────────────────
-- Live Match 1: Arsenal 2-1 Chelsea (67')
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(1, 1, 58.00, 7, 4, 8, 6, 1, 0, 412, 87.30),
(1, 2, 42.00, 4, 5, 11, 3, 2, 0, 298, 81.50);

-- Live Match 2: Real Madrid 1-1 Barcelona (34')
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(2, 5, 46.00, 3, 2, 5, 2, 1, 0, 187, 89.20),
(2, 6, 54.00, 4, 1, 4, 3, 0, 0, 221, 91.00);

-- Live Match 3: Bayern 3-2 Dortmund (82')
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(3, 9, 55.00, 9, 6, 12, 7, 2, 0, 478, 85.40),
(3, 10, 45.00, 6, 4, 14, 5, 3, 1, 389, 79.80);

-- Finished Match 4: Man City 2-2 Liverpool
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(4, 3, 61.00, 8, 5, 9, 8, 1, 0, 587, 90.10),
(4, 4, 39.00, 6, 3, 12, 4, 2, 0, 374, 83.70);

-- Finished Match 5: Barcelona 3-1 Real Madrid
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(5, 6, 57.00, 10, 4, 7, 9, 1, 0, 543, 91.50),
(5, 5, 43.00, 5, 6, 13, 3, 3, 0, 412, 84.20);

-- Finished Match 6: AC Milan 1-0 Juventus
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(6, 7, 52.00, 5, 3, 10, 5, 2, 0, 431, 86.80),
(6, 8, 48.00, 3, 4, 11, 4, 1, 0, 398, 84.50);

-- Finished Match 7: Chelsea 0-2 Man City
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(7, 2, 38.00, 2, 5, 14, 3, 3, 0, 312, 78.90),
(7, 3, 62.00, 7, 3, 6, 7, 0, 0, 521, 91.30);
GO

-- ─── Match Events ───────────────────────────────────────────────────────────────
-- Live Match 1: Arsenal 2-1 Chelsea
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
(1, NULL, NULL, 'KickOff',    1,  N'The match has kicked off at Emirates Stadium!'),
(1, 1,    6,    'Goal',       12, N'Bukayo Saka scores! A brilliant curling shot from outside the box.'),
(1, 2,    16,   'Goal',       28, N'Cole Palmer equalizes with a clinical finish from the edge of the area.'),
(1, 2,    14,   'YellowCard', 35, N'Moisés Caicedo is booked for a late tackle on Ødegaard.'),
(1, NULL, NULL, 'HalfTime',   45, N'Half-time at the Emirates. Arsenal 1-1 Chelsea.'),
(1, 1,    NULL, 'Comment',    52, N'Arsenal pressing high, looking to regain control.'),
(1, 1,    7,    'Goal',       58, N'Kai Havertz heads in from a Saka corner! Arsenal lead again!'),
(1, 2,    15,   'YellowCard', 63, N'Enzo Fernández goes into the book for dissent.'),
(1, 1,    4,    'YellowCard', 66, N'Declan Rice picks up a yellow for time-wasting.');

-- Live Match 2: Real Madrid 1-1 Barcelona
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
(2, NULL, NULL, 'KickOff',    1,  N'El Clásico is underway at the Bernabéu!'),
(2, 6,    57,   'Goal',       15, N'Lamine Yamal with a stunning solo goal! The teenager beats three defenders.'),
(2, 5,    45,   'Goal',       29, N'Jude Bellingham equalizes with a towering header from Carvajal''s cross.'),
(2, 5,    44,   'YellowCard', 32, N'Luka Modrić is cautioned for pulling back Pedri.');

-- Live Match 3: Bayern 3-2 Dortmund
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
(3, NULL, NULL, 'KickOff',     1,  N'Der Klassiker kicks off at the Allianz Arena!'),
(3, 9,    86,   'Goal',        8,  N'Harry Kane fires Bayern ahead with a powerful strike from 20 yards!'),
(3, 10,   97,   'Goal',        23, N'Karim Adeyemi equalizes with a blistering counter-attack goal.'),
(3, 9,    84,   'Goal',        41, N'Jamal Musiala dances through the defence and slots home. 2-1 Bayern!'),
(3, NULL, NULL, 'HalfTime',    45, N'Half-time. Bayern Munich 2-1 Borussia Dortmund.'),
(3, 10,   98,   'Goal',        55, N'Donyell Malen makes it 2-2! Clinical finish after a quick break.'),
(3, 10,   99,   'YellowCard',  61, N'Emre Can booked for a cynical foul on Sané.'),
(3, 9,    86,   'Goal',        72, N'Harry Kane with his second! A penalty coolly converted. 3-2!'),
(3, 10,   92,   'YellowCard',  75, N'Mats Hummels cautioned for pulling back Kane.'),
(3, 10,   94,   'RedCard',     78, N'Marcel Sabitzer receives a second yellow! Dortmund down to 10 men.'),
(3, 9,    85,   'YellowCard',  80, N'Leroy Sané booked for simulation.');

-- Finished Match 4: Man City 2-2 Liverpool
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
(4, 3,    27,   'Goal',       18, N'Erling Haaland opens the scoring with a trademark header.'),
(4, 4,    35,   'Goal',       33, N'Mohamed Salah equalizes! A curling effort into the far corner.'),
(4, 3,    26,   'Goal',       56, N'Phil Foden restores City''s lead with a stunning volley!'),
(4, 4,    37,   'Goal',       71, N'Darwin Núñez makes it 2-2! A poacher''s finish from close range.'),
(4, 3,    25,   'YellowCard', 82, N'Kevin De Bruyne cautioned for a rash challenge.');

-- Finished Match 5: Barcelona 3-1 Real Madrid
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
(5, 6,    56,   'Goal',       11, N'Robert Lewandowski heads in the opener from a Yamal cross.'),
(5, 5,    46,   'Goal',       27, N'Vinícius Júnior levels it up with a dazzling run and finish.'),
(5, 6,    58,   'Goal',       54, N'Raphinha curls a free kick into the top corner! 2-1 Barcelona.'),
(5, 5,    47,   'YellowCard', 67, N'Kylian Mbappé booked for a foul on Koundé.'),
(5, 6,    54,   'Goal',       78, N'Pedri seals it! A beautiful team goal finished off brilliantly.');
GO

-- ─── Player Season Stats ────────────────────────────────────────────────────────
INSERT INTO [dbo].[PlayerSeasonStats] ([PlayerId],[Season],[Goals],[Assists],[YellowCards],[RedCards],[MatchesPlayed],[MinutesPlayed],[Rating]) VALUES
-- Arsenal
(1,  '2025-26', 0,  0,  0, 0, 32, 2880, 7.2),
(2,  '2025-26', 2,  1,  3, 0, 34, 3060, 7.5),
(3,  '2025-26', 4,  0,  4, 0, 33, 2970, 7.3),
(4,  '2025-26', 5,  7,  6, 0, 35, 3150, 7.6),
(5,  '2025-26', 8,  11, 2, 0, 30, 2520, 8.1),
(6,  '2025-26', 16, 12, 1, 0, 35, 3100, 8.4),
(7,  '2025-26', 12, 5,  3, 0, 33, 2640, 7.4),
(8,  '2025-26', 1,  3,  2, 0, 28, 2380, 7.1),
(9,  '2025-26', 1,  4,  3, 0, 29, 2410, 7.0),
(10, '2025-26', 9,  6,  1, 0, 31, 1860, 7.3),
-- Chelsea
(11, '2025-26', 0,  0,  1, 0, 30, 2700, 6.8),
(12, '2025-26', 1,  4,  3, 0, 22, 1760, 6.9),
(13, '2025-26', 0,  1,  2, 0, 18, 1620, 7.0),
(14, '2025-26', 3,  4,  5, 0, 33, 2970, 7.2),
(15, '2025-26', 4,  8,  4, 0, 34, 2890, 7.3),
(16, '2025-26', 18, 9,  1, 0, 35, 3100, 8.5),
(17, '2025-26', 11, 3,  2, 0, 32, 2560, 7.1),
(18, '2025-26', 2,  2,  4, 0, 27, 2290, 7.0),
(19, '2025-26', 8,  5,  2, 0, 30, 2100, 7.2),
(20, '2025-26', 1,  3,  3, 0, 24, 1920, 6.9),
-- Man City
(21, '2025-26', 0,  0,  0, 0, 34, 3060, 7.1),
(22, '2025-26', 2,  0,  5, 0, 32, 2880, 7.3),
(23, '2025-26', 0,  3,  4, 0, 28, 2380, 6.8),
(24, '2025-26', 6,  9,  3, 0, 34, 3060, 8.0),
(25, '2025-26', 7,  14, 1, 0, 28, 2100, 8.3),
(26, '2025-26', 14, 8,  2, 0, 33, 2640, 8.1),
(27, '2025-26', 28, 4,  2, 0, 35, 3100, 8.7),
(28, '2025-26', 5,  10, 1, 0, 32, 2560, 7.8),
(29, '2025-26', 3,  4,  1, 0, 25, 1500, 6.9),
(30, '2025-26', 1,  1,  3, 0, 26, 2210, 7.1),
-- Liverpool
(31, '2025-26', 0,  0,  0, 0, 33, 2970, 7.4),
(32, '2025-26', 3,  1,  4, 0, 34, 3060, 7.5),
(33, '2025-26', 2,  12, 3, 0, 33, 2870, 7.6),
(34, '2025-26', 5,  7,  4, 0, 34, 2890, 7.5),
(35, '2025-26', 19, 10, 1, 0, 35, 3100, 8.6),
(36, '2025-26', 10, 6,  2, 0, 32, 2560, 7.7),
(37, '2025-26', 13, 3,  4, 1, 30, 2100, 7.2),
(38, '2025-26', 7,  5,  3, 0, 31, 2480, 7.3),
(39, '2025-26', 1,  7,  2, 0, 30, 2700, 7.1),
(40, '2025-26', 3,  5,  2, 0, 33, 2640, 7.4),
-- Real Madrid
(41, '2025-26', 0,  0,  0, 0, 28, 2520, 7.3),
(42, '2025-26', 1,  5,  3, 0, 30, 2700, 7.2),
(43, '2025-26', 2,  0,  4, 0, 25, 2250, 7.0),
(44, '2025-26', 3,  8,  2, 0, 28, 1960, 7.6),
(45, '2025-26', 20, 9,  3, 0, 34, 3060, 8.8),
(46, '2025-26', 15, 11, 4, 0, 33, 2870, 8.5),
(47, '2025-26', 22, 6,  3, 0, 34, 2890, 8.6),
(48, '2025-26', 7,  8,  5, 0, 35, 3150, 7.8),
(49, '2025-26', 1,  0,  6, 1, 32, 2880, 7.1),
(50, '2025-26', 9,  7,  1, 0, 31, 2170, 7.7),
-- Barcelona
(51, '2025-26', 0,  0,  0, 0, 30, 2700, 7.2),
(52, '2025-26', 1,  0,  5, 1, 26, 2340, 7.1),
(53, '2025-26', 2,  4,  3, 0, 33, 2970, 7.4),
(54, '2025-26', 9,  12, 2, 0, 34, 2890, 8.3),
(55, '2025-26', 6,  5,  4, 0, 28, 2100, 7.7),
(56, '2025-26', 21, 4,  1, 0, 34, 2720, 8.4),
(57, '2025-26', 14, 10, 0, 0, 33, 2640, 8.6),
(58, '2025-26', 11, 8,  2, 0, 34, 2890, 7.9),
(59, '2025-26', 3,  7,  3, 0, 29, 2320, 7.5),
(60, '2025-26', 1,  5,  2, 0, 31, 2790, 7.2),
-- AC Milan
(61, '2025-26', 0,  0,  0, 0, 32, 2880, 7.3),
(62, '2025-26', 1,  0,  5, 0, 30, 2700, 7.0),
(63, '2025-26', 4,  7,  3, 0, 33, 2970, 7.4),
(64, '2025-26', 8,  6,  2, 0, 34, 3060, 7.8),
(65, '2025-26', 10, 8,  1, 0, 33, 2640, 7.9),
(66, '2025-26', 12, 9,  2, 0, 31, 2480, 8.1),
(67, '2025-26', 7,  2,  1, 0, 25, 1500, 7.0),
(68, '2025-26', 4,  3,  3, 0, 28, 2240, 7.1),
(69, '2025-26', 0,  3,  4, 0, 27, 2430, 6.8),
(70, '2025-26', 1,  0,  3, 0, 22, 1760, 6.9),
-- Juventus
(71, '2025-26', 0,  0,  0, 0, 31, 2790, 7.1),
(72, '2025-26', 2,  0,  4, 0, 29, 2610, 7.2),
(73, '2025-26', 8,  6,  1, 0, 26, 1820, 7.5),
(74, '2025-26', 16, 3,  3, 0, 34, 2890, 8.0),
(75, '2025-26', 2,  5,  4, 0, 33, 2970, 7.1),
(76, '2025-26', 4,  3,  5, 0, 30, 2400, 7.0),
(77, '2025-26', 1,  6,  2, 0, 32, 2880, 7.2),
(78, '2025-26', 5,  4,  1, 0, 28, 1680, 7.0),
(79, '2025-26', 1,  2,  6, 1, 31, 2790, 6.8),
(80, '2025-26', 3,  4,  2, 0, 25, 1750, 7.1),
-- Bayern Munich
(81, '2025-26', 0,  0,  0, 0, 30, 2700, 7.2),
(82, '2025-26', 1,  0,  5, 0, 32, 2880, 7.1),
(83, '2025-26', 4,  10, 4, 0, 35, 3150, 7.9),
(84, '2025-26', 15, 9,  1, 0, 34, 2890, 8.5),
(85, '2025-26', 10, 7,  2, 0, 31, 2170, 7.7),
(86, '2025-26', 30, 8,  2, 0, 35, 3100, 9.0),
(87, '2025-26', 6,  11, 1, 0, 30, 1800, 7.4),
(88, '2025-26', 5,  4,  3, 0, 28, 2240, 7.2),
(89, '2025-26', 2,  8,  2, 0, 33, 2970, 7.3),
(90, '2025-26', 8,  5,  1, 0, 29, 1740, 7.3),
-- Borussia Dortmund
(91,  '2025-26', 0,  0,  0, 0, 33, 2970, 7.3),
(92,  '2025-26', 2,  1,  5, 0, 28, 2520, 7.0),
(93,  '2025-26', 1,  0,  4, 0, 31, 2790, 7.1),
(94,  '2025-26', 4,  5,  6, 1, 32, 2560, 7.0),
(95,  '2025-26', 8,  10, 2, 0, 34, 2890, 7.8),
(96,  '2025-26', 5,  4,  1, 0, 22, 1320, 7.2),
(97,  '2025-26', 9,  3,  1, 0, 28, 1680, 7.4),
(98,  '2025-26', 11, 5,  2, 0, 33, 2310, 7.5),
(99,  '2025-26', 2,  3,  7, 0, 30, 2700, 6.8),
(100, '2025-26', 1,  5,  3, 0, 29, 2610, 7.1);
GO

PRINT 'Seed data inserted successfully.';
GO
