-- ============================================================================
-- World Cup Integration Schema Modifications
-- SQL Server 2022 Express
-- ============================================================================

USE [FootballLiveScores];
GO

-- 1. Modify Leagues Table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Leagues]') AND name = N'IsTournament')
BEGIN
    ALTER TABLE [dbo].[Leagues] ADD [IsTournament] BIT NOT NULL DEFAULT 0;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Leagues]') AND name = N'CurrentStage')
BEGIN
    ALTER TABLE [dbo].[Leagues] ADD [CurrentStage] NVARCHAR(50) NULL;
END
GO

-- 2. Modify Matches Table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND name = N'Stage')
BEGIN
    ALTER TABLE [dbo].[Matches] ADD [Stage] NVARCHAR(50) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND name = N'HomeScoreExtraTime')
BEGIN
    ALTER TABLE [dbo].[Matches] ADD [HomeScoreExtraTime] INT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND name = N'AwayScoreExtraTime')
BEGIN
    ALTER TABLE [dbo].[Matches] ADD [AwayScoreExtraTime] INT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND name = N'HomeScorePenalties')
BEGIN
    ALTER TABLE [dbo].[Matches] ADD [HomeScorePenalties] INT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND name = N'AwayScorePenalties')
BEGIN
    ALTER TABLE [dbo].[Matches] ADD [AwayScorePenalties] INT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND name = N'WinnerId')
BEGIN
    ALTER TABLE [dbo].[Matches] ADD [WinnerId] INT NULL;
    
    ALTER TABLE [dbo].[Matches] 
    ADD CONSTRAINT [FK_Matches_WinnerTeam] 
    FOREIGN KEY ([WinnerId]) REFERENCES [dbo].[Teams]([Id]);
END
GO

-- Create Index for matches stage queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Matches_League_Stage' AND object_id = OBJECT_ID(N'[dbo].[Matches]'))
BEGIN
    CREATE INDEX [IX_Matches_League_Stage] ON [dbo].[Matches]([LeagueId], [Stage]);
END
GO

-- 3. Create GroupStandings Table
IF OBJECT_ID(N'[dbo].[GroupStandings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[GroupStandings] (
        [Id]            INT             IDENTITY(1,1) NOT NULL,
        [LeagueId]      INT             NOT NULL,
        [GroupName]     NVARCHAR(50)    NOT NULL,
        [TeamId]        INT             NOT NULL,
        [Played]        INT             NOT NULL DEFAULT 0,
        [Won]           INT             NOT NULL DEFAULT 0,
        [Drawn]         INT             NOT NULL DEFAULT 0,
        [Lost]          INT             NOT NULL DEFAULT 0,
        [GoalsFor]      INT             NOT NULL DEFAULT 0,
        [GoalsAgainst]  INT             NOT NULL DEFAULT 0,
        [Points]        INT             NOT NULL DEFAULT 0,
        CONSTRAINT [PK_GroupStandings] PRIMARY KEY CLUSTERED ([Id]),
        CONSTRAINT [FK_GroupStandings_Leagues] FOREIGN KEY ([LeagueId]) REFERENCES [dbo].[Leagues]([Id]),
        CONSTRAINT [FK_GroupStandings_Teams] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Teams]([Id]),
        CONSTRAINT [UQ_GroupStandings_League_Team] UNIQUE ([LeagueId], [TeamId])
    );

    CREATE INDEX [IX_GroupStandings_League_GroupName] ON [dbo].[GroupStandings]([LeagueId], [GroupName]);
END
GO

PRINT 'World Cup schema modifications applied successfully.';
GO
