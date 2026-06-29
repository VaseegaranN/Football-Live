-- ============================================================================
-- Football Live Scores Database Schema
-- SQL Server 2022 Express
-- ============================================================================

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'FootballLiveScores')
BEGIN
    ALTER DATABASE [FootballLiveScores] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [FootballLiveScores];
END
GO

CREATE DATABASE [FootballLiveScores];
GO

USE [FootballLiveScores];
GO

-- ─── Leagues ────────────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[Leagues] (
    [Id]        INT             IDENTITY(1,1) NOT NULL,
    [Name]      NVARCHAR(100)   NOT NULL,
    [Country]   NVARCHAR(100)   NOT NULL,
    [Logo]      NVARCHAR(500)   NULL,
    CONSTRAINT [PK_Leagues] PRIMARY KEY CLUSTERED ([Id])
);
GO

-- ─── Teams ──────────────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[Teams] (
    [Id]        INT             IDENTITY(1,1) NOT NULL,
    [LeagueId]  INT             NOT NULL,
    [Name]      NVARCHAR(100)   NOT NULL,
    [ShortName] NVARCHAR(5)     NOT NULL,
    [Logo]      NVARCHAR(500)   NULL,
    [Stadium]   NVARCHAR(200)   NULL,
    CONSTRAINT [PK_Teams] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_Teams_Leagues] FOREIGN KEY ([LeagueId]) REFERENCES [dbo].[Leagues]([Id])
);
GO

CREATE INDEX [IX_Teams_LeagueId] ON [dbo].[Teams]([LeagueId]);
GO

-- ─── Players ────────────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[Players] (
    [Id]            INT             IDENTITY(1,1) NOT NULL,
    [TeamId]        INT             NOT NULL,
    [Name]          NVARCHAR(150)   NOT NULL,
    [Position]      NVARCHAR(30)    NOT NULL,
    [Number]        INT             NULL,
    [Nationality]   NVARCHAR(100)   NOT NULL,
    [DateOfBirth]   DATE            NULL,
    [Photo]         NVARCHAR(500)   NULL,
    CONSTRAINT [PK_Players] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_Players_Teams] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Teams]([Id])
);
GO

CREATE INDEX [IX_Players_TeamId] ON [dbo].[Players]([TeamId]);
GO

-- ─── Matches ────────────────────────────────────────────────────────────────────
CREATE TABLE [dbo].[Matches] (
    [Id]            INT             IDENTITY(1,1) NOT NULL,
    [LeagueId]      INT             NOT NULL,
    [HomeTeamId]    INT             NOT NULL,
    [AwayTeamId]    INT             NOT NULL,
    [MatchDateTime] DATETIME2       NOT NULL,
    [Status]        NVARCHAR(20)    NOT NULL DEFAULT 'Upcoming',
    [HomeScore]     INT             NOT NULL DEFAULT 0,
    [AwayScore]     INT             NOT NULL DEFAULT 0,
    [Minute]        INT             NULL,
    [Venue]         NVARCHAR(200)   NULL,
    CONSTRAINT [PK_Matches] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_Matches_Leagues] FOREIGN KEY ([LeagueId]) REFERENCES [dbo].[Leagues]([Id]),
    CONSTRAINT [FK_Matches_HomeTeam] FOREIGN KEY ([HomeTeamId]) REFERENCES [dbo].[Teams]([Id]),
    CONSTRAINT [FK_Matches_AwayTeam] FOREIGN KEY ([AwayTeamId]) REFERENCES [dbo].[Teams]([Id]),
    CONSTRAINT [CK_Matches_Status] CHECK ([Status] IN ('Upcoming', 'Live', 'Finished'))
);
GO

CREATE INDEX [IX_Matches_Status_DateTime] ON [dbo].[Matches]([Status], [MatchDateTime]);
CREATE INDEX [IX_Matches_HomeTeamId] ON [dbo].[Matches]([HomeTeamId]);
CREATE INDEX [IX_Matches_AwayTeamId] ON [dbo].[Matches]([AwayTeamId]);
CREATE INDEX [IX_Matches_LeagueId] ON [dbo].[Matches]([LeagueId]);
CREATE INDEX [IX_Matches_DateTime] ON [dbo].[Matches]([MatchDateTime]);
GO

-- ─── Match Statistics ───────────────────────────────────────────────────────────
CREATE TABLE [dbo].[MatchStatistics] (
    [Id]            INT             IDENTITY(1,1) NOT NULL,
    [MatchId]       INT             NOT NULL,
    [TeamId]        INT             NOT NULL,
    [Possession]    DECIMAL(5,2)    NOT NULL DEFAULT 0,
    [ShotsOnTarget] INT             NOT NULL DEFAULT 0,
    [ShotsOffTarget] INT            NOT NULL DEFAULT 0,
    [Fouls]         INT             NOT NULL DEFAULT 0,
    [Corners]       INT             NOT NULL DEFAULT 0,
    [YellowCards]   INT             NOT NULL DEFAULT 0,
    [RedCards]      INT             NOT NULL DEFAULT 0,
    [Passes]        INT             NOT NULL DEFAULT 0,
    [PassAccuracy]  DECIMAL(5,2)    NOT NULL DEFAULT 0,
    CONSTRAINT [PK_MatchStatistics] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_MatchStats_Matches] FOREIGN KEY ([MatchId]) REFERENCES [dbo].[Matches]([Id]),
    CONSTRAINT [FK_MatchStats_Teams] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Teams]([Id]),
    CONSTRAINT [UQ_MatchStats_MatchTeam] UNIQUE ([MatchId], [TeamId])
);
GO

CREATE INDEX [IX_MatchStatistics_MatchId] ON [dbo].[MatchStatistics]([MatchId]);
GO

-- ─── Match Events (Commentary / Timeline) ──────────────────────────────────────
CREATE TABLE [dbo].[MatchEvents] (
    [Id]            INT             IDENTITY(1,1) NOT NULL,
    [MatchId]       INT             NOT NULL,
    [TeamId]        INT             NULL,
    [PlayerId]      INT             NULL,
    [EventType]     NVARCHAR(30)    NOT NULL,
    [Minute]        INT             NOT NULL,
    [Description]   NVARCHAR(500)   NULL,
    CONSTRAINT [PK_MatchEvents] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_MatchEvents_Matches] FOREIGN KEY ([MatchId]) REFERENCES [dbo].[Matches]([Id]),
    CONSTRAINT [FK_MatchEvents_Teams] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Teams]([Id]),
    CONSTRAINT [FK_MatchEvents_Players] FOREIGN KEY ([PlayerId]) REFERENCES [dbo].[Players]([Id]),
    CONSTRAINT [CK_MatchEvents_Type] CHECK ([EventType] IN ('Goal', 'YellowCard', 'RedCard', 'Substitution', 'Comment', 'HalfTime', 'KickOff'))
);
GO

CREATE INDEX [IX_MatchEvents_MatchId] ON [dbo].[MatchEvents]([MatchId]);
GO

-- ─── Player Season Stats ────────────────────────────────────────────────────────
CREATE TABLE [dbo].[PlayerSeasonStats] (
    [Id]            INT             IDENTITY(1,1) NOT NULL,
    [PlayerId]      INT             NOT NULL,
    [Season]        NVARCHAR(10)    NOT NULL,
    [Goals]         INT             NOT NULL DEFAULT 0,
    [Assists]       INT             NOT NULL DEFAULT 0,
    [YellowCards]   INT             NOT NULL DEFAULT 0,
    [RedCards]      INT             NOT NULL DEFAULT 0,
    [MatchesPlayed] INT             NOT NULL DEFAULT 0,
    [MinutesPlayed] INT             NOT NULL DEFAULT 0,
    [Rating]        DECIMAL(3,1)    NOT NULL DEFAULT 0,
    CONSTRAINT [PK_PlayerSeasonStats] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [FK_PlayerStats_Players] FOREIGN KEY ([PlayerId]) REFERENCES [dbo].[Players]([Id]),
    CONSTRAINT [UQ_PlayerStats_PlayerSeason] UNIQUE ([PlayerId], [Season])
);
GO

CREATE INDEX [IX_PlayerSeasonStats_PlayerId] ON [dbo].[PlayerSeasonStats]([PlayerId]);
GO

PRINT 'Schema created successfully.';
GO
