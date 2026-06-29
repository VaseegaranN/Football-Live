-- ============================================================================
-- World Cup Seed Data (FIFA World Cup 2026)
-- SQL Server 2022 Express - UTF-8
-- ============================================================================

USE [FootballLiveScores];
GO

-- 1. Insert FIFA World Cup League (Id: 5)
SET IDENTITY_INSERT [dbo].[Leagues] ON;
INSERT INTO [dbo].[Leagues] ([Id], [Name], [Country], [Logo], [IsTournament], [CurrentStage]) VALUES
(5, N'FIFA World Cup 2026', N'USA/Canada/Mexico', N'world-cup', 1, N'Group Stage');
SET IDENTITY_INSERT [dbo].[Leagues] OFF;
GO

-- 2. Insert International Teams (Ids: 11 to 43)
SET IDENTITY_INSERT [dbo].[Teams] ON;
INSERT INTO [dbo].[Teams] ([Id], [LeagueId], [Name], [ShortName], [Logo], [Stadium]) VALUES
-- Existing teams updated with FlagCDN URLs
(11, 5, N'Argentina',    N'ARG', N'https://flagcdn.com/w80/ar.png', N'Estadio Azteca'),
(12, 5, N'Poland',       N'POL', N'https://flagcdn.com/w80/pl.png', N'MetLife Stadium'),
(13, 5, N'Mexico',       N'MEX', N'https://flagcdn.com/w80/mx.png', N'Estadio Azteca'),
(14, 5, N'Saudi Arabia', N'KSA', N'https://flagcdn.com/w80/sa.png', N'Mercedes-Benz Stadium'),
(15, 5, N'France',       N'FRA', N'https://flagcdn.com/w80/fr.png', N'SoFi Stadium'),
(16, 5, N'Denmark',      N'DEN', N'https://flagcdn.com/w80/dk.png', N'Hard Rock Stadium'),
(17, 5, N'Australia',    N'AUS', N'https://flagcdn.com/w80/au.png', N'Lincoln Financial Field'),
(18, 5, N'Tunisia',      N'TUN', N'https://flagcdn.com/w80/tn.png', N'NRG Stadium'),
(19, 5, N'Brazil',       N'BRA', N'https://flagcdn.com/w80/br.png', N'MetLife Stadium'),
(20, 5, N'Switzerland',  N'SUI', N'https://flagcdn.com/w80/ch.png', N'Gillette Stadium'),
(21, 5, N'Cameroon',     N'CMR', N'https://flagcdn.com/w80/cm.png', N'SoFi Stadium'),
(22, 5, N'Serbia',       N'SRB', N'https://flagcdn.com/w80/rs.png', N'Arrowhead Stadium'),
(23, 5, N'Morocco',      N'MAR', N'https://flagcdn.com/w80/ma.png', N'Lumen Field'),
(24, 5, N'Croatia',      N'CRO', N'https://flagcdn.com/w80/hr.png', N'BC Place'),
(25, 5, N'Belgium',      N'BEL', N'https://flagcdn.com/w80/be.png', N'Levi''s Stadium'),
(26, 5, N'Canada',       N'CAN', N'https://flagcdn.com/w80/ca.png', N'BMO Field'),
-- New teams from Photo 1 & 2
(27, 5, N'Norway',       N'NOR', N'https://flagcdn.com/w80/no.png', N'Gillette Stadium'),
(28, 5, N'Senegal',      N'SEN', N'https://flagcdn.com/w80/sn.png', N'Lincoln Financial Field'),
(29, 5, N'Iraq',         N'IRQ', N'https://flagcdn.com/w80/iq.png', N'Mercedes-Benz Stadium'),
(30, 5, N'Cabo Verde',   N'CPV', N'https://flagcdn.com/w80/cv.png', N'NRG Stadium'),
(31, 5, N'Panama',       N'PAN', N'https://flagcdn.com/w80/pa.png', N'Hard Rock Stadium'),
(32, 5, N'England',      N'ENG', N'https://flagcdn.com/w80/gb-eng.png', N'SoFi Stadium'),
(33, 5, N'Ghana',        N'GHA', N'https://flagcdn.com/w80/gh.png', N'MetLife Stadium'),
(34, 5, N'Colombia',     N'COL', N'https://flagcdn.com/w80/co.png', N'Lumen Field'),
(35, 5, N'Portugal',     N'POR', N'https://flagcdn.com/w80/pt.png', N'BC Place'),
(36, 5, N'DR Congo',     N'COD', N'https://flagcdn.com/w80/cd.png', N'BMO Field'),
(37, 5, N'Uzbekistan',   N'UZB', N'https://flagcdn.com/w80/uz.png', N'Arrowhead Stadium'),
(38, 5, N'Egypt',        N'EGY', N'https://flagcdn.com/w80/eg.png', N'Estadio Azteca'),
(39, 5, N'Iran',         N'IRN', N'https://flagcdn.com/w80/ir.png', N'Hard Rock Stadium'),
(40, 5, N'New Zealand',  N'NZL', N'https://flagcdn.com/w80/nz.png', N'MetLife Stadium'),
(41, 5, N'South Africa', N'RSA', N'https://flagcdn.com/w80/za.png', N'Mercedes-Benz Stadium'),
(42, 5, N'South Korea',  N'KOR', N'https://flagcdn.com/w80/kr.png', N'SoFi Stadium'),
(43, 5, N'Czechia',      N'CZE', N'https://flagcdn.com/w80/cz.png', N'Estadio Azteca'),
(44, 5, N'Netherlands',  N'NED', N'https://flagcdn.com/w80/nl.png', N'MetLife Stadium'),
(45, 5, N'Paraguay',     N'PAR', N'https://flagcdn.com/w80/py.png', N'Hard Rock Stadium'),
(46, 5, N'Germany',      N'GER', N'https://flagcdn.com/w80/de.png', N'SoFi Stadium'),
(47, 5, N'Sweden',       N'SWE', N'https://flagcdn.com/w80/se.png', N'Estadio Azteca');
SET IDENTITY_INSERT [dbo].[Teams] OFF;
GO

-- 3. Seed Players with birth dates
SET IDENTITY_INSERT [dbo].[Players] ON;
INSERT INTO [dbo].[Players] ([Id],[TeamId],[Name],[Position],[Number],[Nationality],[DateOfBirth]) VALUES
-- Argentina (ARG)
(101, 11, N'Lionel Messi',      N'Forward',     10, N'Argentina', '1987-06-24'),
(102, 11, N'Emiliano Martínez', N'Goalkeeper',  23, N'Argentina', '1992-09-02'),
(103, 11, N'Enzo Fernández',    N'Midfielder',  24, N'Argentina', '2001-01-17'),
(104, 11, N'Alexis Mac Allister',N'Midfielder', 20, N'Argentina', '1998-12-24'),
(105, 11, N'Julián Álvarez',    N'Forward',     9,  N'Argentina', '2000-01-31'),
(126, 11, N'Cristian Romero',   N'Defender',    13, N'Argentina', '1998-04-27'),
(127, 11, N'Nicolás Otamendi',  N'Defender',    19, N'Argentina', '1988-02-12'),
(128, 11, N'Nicolás Tagliafico', N'Defender',   3,  N'Argentina', '1992-08-31'),
(129, 11, N'Nahuel Molina',     N'Defender',    26, N'Argentina', '1998-04-06'),
(163, 11, N'Rodrigo De Paul',   N'Midfielder',  7,  N'Argentina', '1994-05-24'),
(164, 11, N'Ángel Di María',    N'Forward',     11, N'Argentina', '1988-02-14'),
(165, 11, N'Lautaro Martínez',  N'Forward',     22, N'Argentina', '1997-08-22'),
(166, 11, N'Lisandro Martínez', N'Defender',    25, N'Argentina', '1998-01-18'),
(167, 11, N'Gonzalo Montiel',   N'Defender',    4,  N'Argentina', '1997-01-01'),

-- France (FRA)
(106, 15, N'Kylian Mbappé',     N'Forward',     10, N'France',    '1998-12-20'),
(107, 15, N'Antoine Griezmann', N'Midfielder',  7,  N'France',    '1991-03-21'),
(108, 15, N'Aurélien Tchouaméni',N'Midfielder', 8,  N'France',    '2000-01-27'),
(109, 15, N'Theo Hernández',    N'Defender',    22, N'France',    '1997-10-06'),
(110, 15, N'Mike Maignan',      N'Goalkeeper',  16, N'France',    '1995-07-03'),
(168, 15, N'Olivier Giroud',    N'Forward',     9,  N'France',    '1986-09-30'),
(169, 15, N'Ousmane Dembélé',   N'Forward',     11, N'France',    '1997-05-15'),
(170, 15, N'Kingsley Coman',    N'Forward',     20, N'France',    '1996-06-13'),
(171, 15, N'Eduardo Camavinga', N'Midfielder',  6,  N'France',    '2002-11-10'),
(172, 15, N'Adrien Rabiot',     N'Midfielder',  14, N'France',    '1995-04-03'),
(173, 15, N'Dayot Upamecano',   N'Defender',    4,  N'France',    '1998-10-27'),
(174, 15, N'William Saliba',    N'Defender',    17, N'France',    '2001-03-24'),
(175, 15, N'Jules Koundé',      N'Defender',    5,  N'France',    '1998-11-12'),
(176, 15, N'Benjamin Pavard',   N'Defender',    2,  N'France',    '1996-03-28'),

-- Brazil (BRA)
(111, 19, N'Vinícius Júnior',   N'Forward',     7,  N'Brazil',    '2000-07-12'),
(112, 19, N'Rodrygo',           N'Forward',     11, N'Brazil',    '2001-01-09'),
(113, 19, N'Bruno Guimarães',   N'Midfielder',  5,  N'Brazil',    '1997-11-16'),
(114, 19, N'Marquinhos',        N'Defender',    4,  N'Brazil',    '1994-05-14'),
(115, 19, N'Alisson Becker',    N'Goalkeeper',  1,  N'Brazil',    '1992-10-02'),
(151, 19, N'Casemiro',          N'Midfielder',  18, N'Brazil',    '1992-02-23'),
(152, 19, N'Neymar Jr',         N'Forward',     10, N'Brazil',    '1992-02-05'),
(153, 19, N'Raphinha',          N'Forward',     19, N'Brazil',    '1996-12-14'),
(154, 19, N'Richarlison',       N'Forward',     9,  N'Brazil',    '1997-04-10'),
(155, 19, N'Gabriel Magalhães', N'Defender',    14, N'Brazil',    '1997-12-19'),
(156, 19, N'Danilo',            N'Defender',    2,  N'Brazil',    '1991-07-15'),
(157, 19, N'Eder Militão',      N'Defender',    3,  N'Brazil',    '1998-01-18'),
(158, 19, N'Ederson Moraes',    N'Goalkeeper',  23, N'Brazil',    '1993-08-17'),

-- Croatia (CRO)
(116, 24, N'Luka Modrić',       N'Midfielder',  10, N'Croatia',   '1985-09-09'),
(117, 24, N'Mateo Kovačić',     N'Midfielder',  8,  N'Croatia',   '1994-05-06'),
(118, 24, N'Joško Gvardiol',    N'Defender',    4,  N'Croatia',   '2002-01-23'),
(119, 24, N'Ivan Perišić',      N'Midfielder',  14, N'Croatia',   '1989-02-02'),
(120, 24, N'Dominik Livaković', N'Goalkeeper',  1,  N'Croatia',   '1995-01-09'),
(130, 24, N'Andrej Kramarić',   N'Forward',     9,  N'Croatia',   '1991-06-19'),
(131, 24, N'Bruno Petković',    N'Forward',     17, N'Croatia',   '1994-09-16'),
(185, 24, N'Ivan Ivanušec',     N'Midfielder',  16, N'Croatia',   '1998-11-26'),
(186, 24, N'Lovro Majer',       N'Midfielder',  7,  N'Croatia',   '1998-01-17'),
(187, 24, N'Mario Pašalić',     N'Midfielder',  15, N'Croatia',   '1995-02-09'),
(188, 24, N'Domagoj Vida',      N'Defender',    21, N'Croatia',   '1989-04-29'),
(189, 24, N'Borna Sosa',        N'Defender',    3,  N'Croatia',   '1998-01-21'),
(190, 24, N'Josip Šutalo',      N'Defender',    6,  N'Croatia',   '2000-02-28'),
(191, 24, N'Nediljko Labrović', N'Goalkeeper',  12, N'Croatia',   '1999-10-10'),

-- Morocco (MAR)
(121, 23, N'Achraf Hakimi',     N'Defender',    2,  N'Morocco',   '1998-11-04'),
(122, 23, N'Sofyan Amrabat',    N'Midfielder',  4,  N'Morocco',   '1996-08-21'),
(123, 23, N'Hakim Ziyech',      N'Forward',     7,  N'Morocco',   '1993-03-19'),
(124, 23, N'Yassine Bounou',    N'Goalkeeper',  1,  N'Morocco',   '1991-04-05'),
(125, 23, N'Youssef En-Nesyri', N'Forward',     19, N'Morocco',   '1997-06-01'),
(211, 23, N'Azzedine Ounahi',   N'Midfielder',  8,  N'Morocco',   '2000-03-02'),
(212, 23, N'Selim Amallah',     N'Midfielder',  15, N'Morocco',   '1996-11-15'),
(213, 23, N'Sofiane Boufal',    N'Forward',     17, N'Morocco',   '1993-09-17'),
(214, 23, N'Noussair Mazraoui', N'Defender',    3,  N'Morocco',   '1997-11-14'),
(215, 23, N'Nayef Aguerd',      N'Defender',    5,  N'Morocco',   '1996-03-30'),
(216, 23, N'Romain Saïss',      N'Defender',    6,  N'Morocco',   '1990-03-26'),

-- Denmark (DEN)
(132, 16, N'Kasper Schmeichel', N'Goalkeeper',  1,  N'Denmark',   '1986-11-05'),
(133, 16, N'Andreas Christensen',N'Defender',   6,  N'Denmark',   '1996-04-10'),
(134, 16, N'Simon Kjær',        N'Defender',    4,  N'Denmark',   '1989-03-26'),
(135, 16, N'Christian Eriksen', N'Midfielder',  10, N'Denmark',   '1992-02-14'),
(136, 16, N'Rasmus Højlund',    N'Forward',     9,  N'Denmark',   '2003-02-04'),
(137, 16, N'Pierre-Emile Højbjerg',N'Midfielder',23,N'Denmark',   '1995-08-05'),
(179, 16, N'Jonas Wind',        N'Forward',     19, N'Denmark',   '1999-02-07'),
(180, 16, N'Yussuf Poulsen',    N'Forward',     20, N'Denmark',   '1994-06-15'),
(181, 16, N'Mikkel Damsgaard',  N'Midfielder',  14, N'Denmark',   '2000-07-03'),
(182, 16, N'Mathias Jensen',    N'Midfielder',  15, N'Denmark',   '1996-01-01'),
(183, 16, N'Joachim Andersen',  N'Defender',    2,  N'Denmark',   '1996-05-31'),
(184, 16, N'Joakim Mæhle',      N'Defender',    5,  N'Denmark',   '1997-05-20'),
(209, 16, N'Victor Nelsson',    N'Defender',    3,  N'Denmark',   '1998-10-14'),
(210, 16, N'Frederik Rønnow',   N'Goalkeeper',  22, N'Denmark',   '1992-08-04'),

-- Norway (NOR)
(138, 27, N'Erling Haaland',    N'Forward',     9,  N'Norway',    '2000-07-21'),
(139, 27, N'Martin Ødegaard',   N'Midfielder',  10, N'Norway',    '1998-12-17'),
(192, 27, N'Alexander Sørloth', N'Forward',     19, N'Norway',    '1995-12-05'),
(193, 27, N'Antonio Nusa',      N'Forward',     20, N'Norway',    '2005-04-17'),
(194, 27, N'Patrick Berg',      N'Midfielder',  6,  N'Norway',    '1997-11-24'),
(195, 27, N'Sander Berge',      N'Midfielder',  8,  N'Norway',    '1998-02-14'),
(196, 27, N'Morten Thorsby',    N'Midfielder',  2,  N'Norway',    '1996-05-05'),
(197, 27, N'Kristoffer Ajer',   N'Defender',    4,  N'Norway',    '1998-04-17'),
(198, 27, N'Leo Østigård',      N'Defender',    15, N'Norway',    '1999-11-28'),
(199, 27, N'Marcus Holmgren Pedersen',N'Defender',22,N'Norway',   '2000-07-16'),
(200, 27, N'Ørjan Nyland',      N'Goalkeeper',  1,  N'Norway',    '1990-09-10'),

-- Senegal (SEN)
(140, 28, N'Sadio Mané',        N'Forward',     10, N'Senegal',   '1992-04-10'),
(141, 28, N'Kalidou Koulibaly', N'Defender',    3,  N'Senegal',   '1991-06-20'),
(150, 28, N'Édouard Mendy',     N'Goalkeeper',  16, N'Senegal',   '1992-03-01'),
(201, 28, N'Nicolas Jackson',   N'Forward',     9,  N'Senegal',   '2001-06-20'),
(202, 28, N'Boulaye Dia',       N'Forward',     7,  N'Senegal',   '1996-11-16'),
(203, 28, N'Idrissa Gueye',     N'Midfielder',  5,  N'Senegal',   '1989-09-26'),
(204, 28, N'Pape Matar Sarr',   N'Midfielder',  17, N'Senegal',   '2002-09-14'),
(205, 28, N'Nampalys Mendy',    N'Midfielder',  6,  N'Senegal',   '1992-06-23'),
(206, 28, N'Abdou Diallo',      N'Defender',    22, N'Senegal',   '1996-05-04'),
(207, 28, N'Youssouf Sabaly',   N'Defender',    2,  N'Senegal',   '1993-03-05'),
(208, 28, N'Fodé Ballo-Touré',  N'Defender',    12, N'Senegal',   '1997-01-03'),

-- England (ENG)
(142, 32, N'Jude Bellingham',   N'Midfielder',  10, N'England',   '2003-06-29'),
(143, 32, N'Harry Kane',        N'Forward',     9,  N'England',   '1993-07-28'),
(144, 32, N'Bukayo Saka',       N'Forward',     7,  N'England',   '2001-09-05'),
-- Portugal (POR)
(145, 35, N'Cristiano Ronaldo', N'Forward',     7,  N'Portugal',  '1985-02-05'),
(146, 35, N'Bruno Fernandes',   N'Midfielder',  8,  N'Portugal',  '1994-09-08'),
-- Egypt (EGY)
(147, 38, N'Mohamed Salah',     N'Forward',     11, N'Egypt',     '1992-06-15');
SET IDENTITY_INSERT [dbo].[Players] OFF;
GO

-- 4. Seed Group Standings (exactly matching screenshot Group A, and seeding others)
-- Group A: Mexico, South Africa, South Korea, Czechia
INSERT INTO [dbo].[GroupStandings] ([LeagueId],[GroupName],[TeamId],[Played],[Won],[Drawn],[Lost],[GoalsFor],[GoalsAgainst],[Points]) VALUES
(5, N'Group A', 13, 3, 3, 0, 0, 8, 2, 9),  -- Mexico
(5, N'Group A', 41, 3, 1, 1, 1, 4, 5, 4),  -- South Africa
(5, N'Group A', 42, 3, 1, 0, 2, 3, 4, 3),  -- South Korea
(5, N'Group A', 43, 3, 0, 1, 2, 2, 6, 1);  -- Czechia

-- Group G (Egypt 1-1 Iran, NZ 1-5 Belgium -> Belgium 3pts, Egypt 1pt, Iran 1pt, NZ 0pts)
INSERT INTO [dbo].[GroupStandings] ([LeagueId],[GroupName],[TeamId],[Played],[Won],[Drawn],[Lost],[GoalsFor],[GoalsAgainst],[Points]) VALUES
(5, N'Group G', 25, 1, 1, 0, 0, 5, 1, 3),  -- Belgium
(5, N'Group G', 38, 1, 0, 1, 0, 1, 1, 1),  -- Egypt
(5, N'Group G', 39, 1, 0, 1, 0, 1, 1, 1),  -- Iran
(5, N'Group G', 40, 1, 0, 0, 1, 1, 5, 0);  -- New Zealand

-- Group I (Norway 1-4 France, Senegal 5-0 Iraq)
INSERT INTO [dbo].[GroupStandings] ([LeagueId],[GroupName],[TeamId],[Played],[Won],[Drawn],[Lost],[GoalsFor],[GoalsAgainst],[Points]) VALUES
(5, N'Group I', 15, 1, 1, 0, 0, 4, 1, 3),  -- France
(5, N'Group I', 28, 1, 1, 0, 0, 5, 0, 3),  -- Senegal
(5, N'Group I', 27, 1, 0, 0, 1, 1, 4, 0),  -- Norway
(5, N'Group I', 29, 1, 0, 0, 1, 0, 5, 0);  -- Iraq

-- Group H (Cabo Verde 0-0 Saudi Arabia)
INSERT INTO [dbo].[GroupStandings] ([LeagueId],[GroupName],[TeamId],[Played],[Won],[Drawn],[Lost],[GoalsFor],[GoalsAgainst],[Points]) VALUES
(5, N'Group H', 30, 1, 0, 1, 0, 0, 0, 1),  -- Cabo Verde
(5, N'Group H', 14, 1, 0, 1, 0, 0, 0, 1);  -- Saudi Arabia

-- Group L
INSERT INTO [dbo].[GroupStandings] ([LeagueId],[GroupName],[TeamId],[Played],[Won],[Drawn],[Lost],[GoalsFor],[GoalsAgainst],[Points]) VALUES
(5, N'Group L', 32, 0, 0, 0, 0, 0, 0, 0),  -- England
(5, N'Group L', 24, 0, 0, 0, 0, 0, 0, 0),  -- Croatia
(5, N'Group L', 31, 0, 0, 0, 0, 0, 0, 0),  -- Panama
(5, N'Group L', 33, 0, 0, 0, 0, 0, 0, 0);  -- Ghana

-- Group K
INSERT INTO [dbo].[GroupStandings] ([LeagueId],[GroupName],[TeamId],[Played],[Won],[Drawn],[Lost],[GoalsFor],[GoalsAgainst],[Points]) VALUES
(5, N'Group K', 35, 0, 0, 0, 0, 0, 0, 0),  -- Portugal
(5, N'Group K', 34, 0, 0, 0, 0, 0, 0, 0),  -- Colombia
(5, N'Group K', 36, 0, 0, 0, 0, 0, 0, 0),  -- DR Congo
(5, N'Group K', 37, 0, 0, 0, 0, 0, 0, 0);  -- Uzbekistan
GO

-- 6. Insert Matches (shifting relative dates to make today matches show TODAY)
DECLARE @Today DATE = CAST(GETDATE() AS DATE);

SET IDENTITY_INSERT [dbo].[Matches] ON;

-- LIVE / TODAY Finished Matches (Photo 1 & 2)
-- Group I: Norway vs France (1-4)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(101, 5, 27, 15, CAST(@Today AS DATETIME), 'Finished', 1, 4, 90, N'Boston Stadium', N'Group I');

-- Group I: Senegal vs Iraq (5-0)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(102, 5, 28, 29, CAST(@Today AS DATETIME), 'Finished', 5, 0, 90, N'Toronto Stadium', N'Group I');

-- Group H: Cabo Verde vs Saudi Arabia (0-0)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(103, 5, 30, 14, CAST(@Today AS DATETIME), 'Finished', 0, 0, 90, N'Houston Stadium', N'Group H');

-- Group G: Egypt vs Iran (1-1)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(104, 5, 38, 39, CAST(@Today AS DATETIME), 'Finished', 1, 1, 90, N'Hard Rock Stadium', N'Group G');

-- Group G: New Zealand vs Belgium (1-5)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(105, 5, 40, 25, CAST(@Today AS DATETIME), 'Finished', 1, 5, 90, N'MetLife Stadium', N'Group G');


-- TOMORROW Matches (Photo 2)
-- Group L: Panama vs England (Tomorrow at 2:30 AM)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(106, 5, 31, 32, DATEADD(MINUTE, 150, DATEADD(DAY, 1, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'Hard Rock Stadium', N'Group L');

-- Group L: Croatia vs Ghana (Tomorrow at 2:30 AM)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(120, 5, 24, 33, DATEADD(MINUTE, 150, DATEADD(DAY, 1, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'MetLife Stadium', N'Group L');

-- Group K: Colombia vs Portugal (Tomorrow at 5:00 AM)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(121, 5, 34, 35, DATEADD(MINUTE, 300, DATEADD(DAY, 1, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'Lumen Field', N'Group K');

-- Group K: DR Congo vs Uzbekistan (Tomorrow at 5:00 AM)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(122, 5, 36, 37, DATEADD(MINUTE, 300, DATEADD(DAY, 1, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'BMO Field', N'Group K');


-- Knockout Stage Bracket Matches (Round of 32)
-- R32 1: South Africa vs Canada (Finished 0-1)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage],[WinnerId]) VALUES
(301, 5, 41, 26, CAST(@Today AS DATETIME), 'Finished', 0, 1, 90, N'MetLife Stadium', N'Round of 32', 26);

-- R32 2: Netherlands vs Morocco (Upcoming)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(302, 5, 44, 23, DATEADD(MINUTE, 390, DATEADD(DAY, 1, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'Estadio Azteca', N'Round of 32');

-- R32 3: Germany vs Paraguay (Upcoming)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(303, 5, 46, 45, DATEADD(MINUTE, 120, DATEADD(DAY, 1, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'Hard Rock Stadium', N'Round of 32');

-- R32 4: France vs Sweden (Upcoming)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(304, 5, 15, 47, DATEADD(MINUTE, 150, DATEADD(DAY, 2, CAST(@Today AS DATETIME))), 'Upcoming', 0, 0, NULL, N'SoFi Stadium', N'Round of 32');


-- Knockout Stage Bracket Matches (Round of 16)
-- R16 1: Canada vs Poland (Upcoming)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(401, 5, 26, 12, DATEADD(DAY, 5, CAST(@Today AS DATETIME)), 'Upcoming', 0, 0, NULL, N'BMO Field', N'Round of 16');

-- R16 2: Argentina vs Australia (Upcoming)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(402, 5, 11, 17, DATEADD(DAY, 6, CAST(@Today AS DATETIME)), 'Upcoming', 0, 0, NULL, N'SoFi Stadium', N'Round of 16');


-- Knockout Stage Bracket Matches (Quarter-Finals)
-- QF 1: Argentina vs Denmark (Finished AET + Pens 2-2, 3-3, 4-3 Pens)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage],[HomeScoreExtraTime],[AwayScoreExtraTime],[HomeScorePenalties],[AwayScorePenalties],[WinnerId]) VALUES
(107, 5, 11, 16, DATEADD(DAY, -2, @Today), 'Finished', 2, 2, 120, N'SoFi Stadium', N'Quarter-Finals', 3, 3, 4, 3, 11);

-- QF 2: Brazil vs Croatia (Finished AET + Pens 0-0, 1-1, 2-4 Pens)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage],[HomeScoreExtraTime],[AwayScoreExtraTime],[HomeScorePenalties],[AwayScorePenalties],[WinnerId]) VALUES
(108, 5, 19, 24, DATEADD(DAY, -2, @Today), 'Finished', 0, 0, 120, N'MetLife Stadium', N'Quarter-Finals', 1, 1, 2, 4, 24);

-- QF 3: France vs Mexico (Finished 2-1)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage],[HomeScoreExtraTime],[AwayScoreExtraTime],[HomeScorePenalties],[AwayScorePenalties],[WinnerId]) VALUES
(109, 5, 15, 13, DATEADD(DAY, -1, @Today), 'Finished', 2, 1, 90, N'Mercedes-Benz Stadium', N'Quarter-Finals', NULL, NULL, NULL, NULL, 15);

-- QF 4: Morocco vs Switzerland (Finished AET 0-0, 1-0)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage],[HomeScoreExtraTime],[AwayScoreExtraTime],[HomeScorePenalties],[AwayScorePenalties],[WinnerId]) VALUES
(110, 5, 23, 20, DATEADD(DAY, -1, @Today), 'Finished', 0, 0, 120, N'Hard Rock Stadium', N'Quarter-Finals', 1, 0, NULL, NULL, 23);


-- Semi-Finals (Upcoming/Live - let's set them upcoming in 2 & 3 days)
-- SF 1: Argentina vs Croatia
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(111, 5, 11, 24, DATEADD(DAY, 2, @Today), 'Upcoming', 0, 0, NULL, N'Estadio Azteca', N'Semi-Finals');

-- SF 2: France vs Morocco
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(112, 5, 15, 23, DATEADD(DAY, 3, @Today), 'Upcoming', 0, 0, NULL, N'SoFi Stadium', N'Semi-Finals');

-- Final (Upcoming in 6 days)
INSERT INTO [dbo].[Matches] ([Id],[LeagueId],[HomeTeamId],[AwayTeamId],[MatchDateTime],[Status],[HomeScore],[AwayScore],[Minute],[Venue],[Stage]) VALUES
(113, 5, 11, 15, DATEADD(DAY, 6, @Today), 'Upcoming', 0, 0, NULL, N'MetLife Stadium', N'Final');

SET IDENTITY_INSERT [dbo].[Matches] OFF;
GO

-- 6. Insert Match Events
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
-- QF 1 Timeline
(107, 11,   101,   'Goal',       34, N'Lionel Messi scores a clinical penalty! Argentina leads 1-0.'),
(107, 11,   105,   'Goal',       62, N'Julián Álvarez doubles the lead with a tap-in from Enzo''s cross.'),
(107, 16,   133,   'Goal',       78, N'Denmark pulls one back! Andreas Christensen scores with a high header from a corner kick.'),
(107, 16,   135,   'Goal',       88, N'Stunning equalizer by Christian Eriksen! A low shot from the edge of the area. 2-2!'),
(107, NULL, NULL,  'HalfTime',   90, N'Full time. We are heading into Extra Time!'),
(107, 11,   101,   'Goal',       104,N'Lionel Messi does it again! Rebound tapped in after Schmeichel''s block. 3-2 Argentina!'),
(107, 16,   136,   'Goal',       115,N'Rasmus Højlund equalizes again! Direct free kick deflected into the net. 3-3!'),
(107, NULL, NULL,  'Comment',    120,N'Extra time finishes. 3-3. The match will be decided by a Penalty Shootout!'),
(107, 11,   101,   'Comment',    121,N'Messi scores his penalty for Argentina! (1-0)'),
(107, 16,   135,   'Comment',    121,N'Christian Eriksen scores! (1-1)'),
(107, 11,   103,   'Comment',    122,N'Enzo Fernández converts! (2-1)'),
(107, 16,   137,   'Comment',    122,N'Emiliano Martínez saves Pierre-Emile Højbjerg''s penalty! (2-1)'),
(107, 11,   104,   'Comment',    123,N'Mac Allister scores! (3-1)'),
(107, 16,   133,   'Comment',    123,N'Andreas Christensen converts. (3-2)'),
(107, 11,   NULL,  'Comment',    124,N'Argentina misses the fourth penalty! (3-2)'),
(107, 16,   136,   'Comment',    124,N'Rasmus Højlund scores! (3-3)'),
(107, 11,   105,   'Comment',    125,N'Julián Álvarez scores! (4-3)'),
(107, 16,   134,   'Comment',    125,N'Emiliano Martínez saves Simon Kjær''s penalty! Argentina wins the shootout 4-3 and advances to the Semi-Finals!');

-- Norway vs France QF/Group stage events
INSERT INTO [dbo].[MatchEvents] ([MatchId],[TeamId],[PlayerId],[EventType],[Minute],[Description]) VALUES
(101, 15, 106, 'Goal', 12, N'Kylian Mbappé opens the scoring with a brilliant solo effort. 0-1 France.'),
(101, 15, 106, 'Goal', 45, N'Mbappé strikes again! A powerful volley into the roof of the net. 0-2 France.'),
(101, 27, 138, 'Goal', 55, N'Erling Haaland pulls one back for Norway! A towering header. 1-2.'),
(101, 15, 107, 'Goal', 72, N'Antoine Griezmann curls in a third goal for France! 1-3.'),
(101, 15, 106, 'Goal', 88, N'Mbappé completes his hat-trick! An absolute masterclass. 1-4.');
GO

-- 7. Insert Statistics
INSERT INTO [dbo].[MatchStatistics] ([MatchId],[TeamId],[Possession],[ShotsOnTarget],[ShotsOffTarget],[Fouls],[Corners],[YellowCards],[RedCards],[Passes],[PassAccuracy]) VALUES
(107, 11, 52.00, 8, 4, 14, 5, 2, 0, 612, 88.50),
(107, 16, 48.00, 6, 7, 18, 6, 3, 0, 582, 84.10),
(101, 27, 40.00, 3, 4, 12, 4, 1, 0, 390, 80.00),
(101, 15, 60.00, 11, 5, 9, 8, 1, 0, 580, 89.20);
GO

-- 8. Seed Player Season Stats for World Cup Players
INSERT INTO [dbo].[PlayerSeasonStats] ([PlayerId],[Season],[Goals],[Assists],[YellowCards],[RedCards],[MatchesPlayed],[MinutesPlayed],[Rating]) VALUES
-- Argentina
(101, '2025-26', 15, 11, 1, 0, 30, 2600, 8.4), -- Lionel Messi
(102, '2025-26', 0,  0,  2, 0, 34, 3060, 7.8), -- Emiliano Martínez
(103, '2025-26', 4,  8,  4, 0, 32, 2700, 7.5), -- Enzo Fernández
(104, '2025-26', 6,  7,  3, 0, 33, 2800, 7.6), -- Alexis Mac Allister
(105, '2025-26', 12, 4,  1, 0, 28, 1900, 7.4), -- Julián Álvarez
(126, '2025-26', 2,  1,  6, 0, 30, 2650, 7.3), -- Cristian Romero
(127, '2025-26', 1,  0,  5, 1, 25, 2100, 7.1), -- Nicolás Otamendi
(128, '2025-26', 0,  3,  4, 0, 28, 2300, 7.0), -- Nicolás Tagliafico
(129, '2025-26', 1,  5,  2, 0, 31, 2600, 7.1), -- Nahuel Molina
-- France
(106, '2025-26', 25, 8,  2, 0, 32, 2800, 8.5), -- Kylian Mbappé
(107, '2025-26', 10, 12, 1, 0, 33, 2750, 8.0), -- Antoine Griezmann
(108, '2025-26', 3,  4,  5, 0, 30, 2500, 7.4), -- Aurélien Tchouaméni
(109, '2025-26', 2,  6,  4, 0, 29, 2450, 7.5), -- Theo Hernández
(110, '2025-26', 0,  0,  1, 0, 32, 2880, 7.6), -- Mike Maignan
-- Brazil
(111, '2025-26', 18, 10, 3, 0, 31, 2700, 8.3), -- Vinícius Júnior
(112, '2025-26', 11, 7,  1, 0, 30, 2400, 7.8), -- Rodrygo
(113, '2025-26', 4,  8,  7, 0, 32, 2800, 7.7), -- Bruno Guimarães
(114, '2025-26', 1,  1,  3, 0, 29, 2550, 7.4), -- Marquinhos
(115, '2025-26', 0,  0,  0, 0, 28, 2520, 7.5), -- Alisson Becker
-- Croatia
(116, '2025-26', 3,  9,  2, 0, 28, 2100, 7.9), -- Luka Modrić
(117, '2025-26', 2,  5,  4, 0, 31, 2500, 7.3), -- Mateo Kovačić
(118, '2025-26', 1,  2,  3, 0, 32, 2880, 7.6), -- Joško Gvardiol
(119, '2025-26', 5,  4,  2, 0, 27, 1950, 7.1), -- Ivan Perišić
(120, '2025-26', 0,  0,  1, 0, 34, 3060, 7.4), -- Dominik Livaković
(130, '2025-26', 14, 3,  2, 0, 30, 2400, 7.3), -- Andrej Kramarić
(131, '2025-26', 9,  4,  3, 0, 26, 1850, 7.1), -- Bruno Petković
-- Morocco
(121, '2025-26', 4,  7,  3, 0, 33, 2900, 7.8), -- Achraf Hakimi
(122, '2025-26', 1,  2,  8, 0, 30, 2600, 7.2), -- Sofyan Amrabat
(123, '2025-26', 5,  8,  2, 0, 25, 1800, 7.4), -- Hakim Ziyech
(124, '2025-26', 0,  0,  1, 0, 31, 2790, 7.5), -- Yassine Bounou
(125, '2025-26', 16, 2,  2, 0, 32, 2600, 7.5), -- Youssef En-Nesyri
-- Denmark
(132, '2025-26', 0,  0,  1, 0, 33, 2970, 7.3), -- Kasper Schmeichel
(133, '2025-26', 1,  1,  2, 0, 28, 2450, 7.2), -- Andreas Christensen
(134, '2025-26', 0,  0,  4, 0, 20, 1600, 6.9), -- Simon Kjær
(135, '2025-26', 4,  9,  1, 0, 32, 2700, 7.5), -- Christian Eriksen
(136, '2025-26', 13, 2,  1, 0, 29, 2200, 7.4), -- Rasmus Højlund
(137, '2025-26', 3,  4,  6, 0, 31, 2650, 7.3), -- Pierre-Emile Højbjerg
-- Norway
(138, '2025-26', 35, 4,  2, 0, 34, 3060, 8.8), -- Erling Haaland
(139, '2025-26', 8,  14, 1, 0, 32, 2780, 8.2), -- Martin Ødegaard
-- Senegal
(140, '2025-26', 18, 9,  2, 0, 31, 2680, 8.0), -- Sadio Mané
(141, '2025-26', 2,  1,  5, 0, 33, 2900, 7.6), -- Kalidou Koulibaly
-- England
(142, '2025-26', 19, 12, 3, 0, 35, 3100, 8.5), -- Jude Bellingham
(143, '2025-26', 28, 5,  1, 0, 34, 3000, 8.6), -- Harry Kane
(144, '2025-26', 15, 14, 0, 0, 33, 2880, 8.4), -- Bukayo Saka
-- Portugal
(145, '2025-26', 22, 4,  1, 0, 31, 2650, 8.2), -- Cristiano Ronaldo
(146, '2025-26', 12, 15, 4, 0, 33, 2950, 8.3), -- Bruno Fernandes
-- Egypt
(147, '2025-26', 24, 11, 2, 0, 35, 3120, 8.5); -- Mohamed Salah
GO

PRINT 'World Cup seed data inserted successfully.';
GO
