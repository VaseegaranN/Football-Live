namespace FootballApi.DTOs;

// ─── Team DTOs ──────────────────────────────────────────────────────────────────
public record TeamBriefDto(int Id, string Name, string ShortName, string? Logo);
public record TeamDetailDto(int Id, string Name, string ShortName, string? Logo, string? Stadium, LeagueBriefDto League, List<PlayerBriefDto> Players);

// ─── League DTOs ────────────────────────────────────────────────────────────────
public record LeagueBriefDto(int Id, string Name, string Country, string? Logo, bool IsTournament = false, string? CurrentStage = null);

// ─── Match DTOs ─────────────────────────────────────────────────────────────────
public record MatchListDto(
    int Id,
    TeamBriefDto HomeTeam,
    TeamBriefDto AwayTeam,
    int HomeScore,
    int AwayScore,
    string Status,
    int? Minute,
    DateTime MatchDateTime,
    string? Venue,
    LeagueBriefDto League,
    string? Stage = null,
    int? HomeScoreExtraTime = null,
    int? AwayScoreExtraTime = null,
    int? HomeScorePenalties = null,
    int? AwayScorePenalties = null,
    int? WinnerId = null
);

public record MatchDetailDto(
    int Id,
    TeamBriefDto HomeTeam,
    TeamBriefDto AwayTeam,
    int HomeScore,
    int AwayScore,
    string Status,
    int? Minute,
    DateTime MatchDateTime,
    string? Venue,
    LeagueBriefDto League,
    MatchStatsDto? HomeStats,
    MatchStatsDto? AwayStats,
    List<MatchEventDto> Events,
    string? Stage = null,
    int? HomeScoreExtraTime = null,
    int? AwayScoreExtraTime = null,
    int? HomeScorePenalties = null,
    int? AwayScorePenalties = null,
    int? WinnerId = null
);

public record MatchStatsDto(
    decimal Possession,
    int ShotsOnTarget,
    int ShotsOffTarget,
    int Fouls,
    int Corners,
    int YellowCards,
    int RedCards,
    int Passes,
    decimal PassAccuracy
);

public record MatchEventDto(
    int Id,
    string EventType,
    int Minute,
    string? Description,
    string? PlayerName,
    string? TeamName,
    string? TeamShortName,
    int? PlayerId = null
);

// ─── Player DTOs ────────────────────────────────────────────────────────────────
public record PlayerBriefDto(int Id, string Name, string Position, int? Number, string Nationality);

public record PlayerProfileDto(
    int Id,
    string Name,
    string Position,
    int? Number,
    string Nationality,
    DateOnly? DateOfBirth,
    string? Photo,
    TeamBriefDto Team,
    List<SeasonStatDto> SeasonStats
);

public record SeasonStatDto(
    string Season,
    int Goals,
    int Assists,
    int YellowCards,
    int RedCards,
    int MatchesPlayed,
    int MinutesPlayed,
    decimal Rating
);

// ─── World Cup DTOs ─────────────────────────────────────────────────────────────
public record GroupStandingDto(
    string GroupName,
    TeamBriefDto Team,
    int Played,
    int Won,
    int Drawn,
    int Lost,
    int GoalsFor,
    int GoalsAgainst,
    int Points,
    int GoalDifference
);

public record BracketMatchDto(
    int Id,
    TeamBriefDto? HomeTeam,
    TeamBriefDto? AwayTeam,
    int HomeScore,
    int AwayScore,
    string Status,
    int? Minute,
    DateTime MatchDateTime,
    string? Venue,
    string Stage,
    int? HomeScoreExtraTime,
    int? AwayScoreExtraTime,
    int? HomeScorePenalties,
    int? AwayScorePenalties,
    int? WinnerId
);

public record BracketRoundDto(
    string RoundName,
    List<BracketMatchDto> Matches
);

public record UpdateMatchDto(
    int HomeScore,
    int AwayScore,
    string Status,
    int? Minute,
    string? Stage,
    int? HomeScoreExtraTime,
    int? AwayScoreExtraTime,
    int? HomeScorePenalties,
    int? AwayScorePenalties,
    int? WinnerId
);
