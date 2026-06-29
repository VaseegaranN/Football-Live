namespace FootballApi.Models;

public class Match
{
    public int Id { get; set; }
    public int LeagueId { get; set; }
    public int HomeTeamId { get; set; }
    public int AwayTeamId { get; set; }
    public DateTime MatchDateTime { get; set; }
    public string Status { get; set; } = "Upcoming";
    public int HomeScore { get; set; }
    public int AwayScore { get; set; }
    public int? Minute { get; set; }
    public string? Venue { get; set; }
    public string? Stage { get; set; }
    public int? HomeScoreExtraTime { get; set; }
    public int? AwayScoreExtraTime { get; set; }
    public int? HomeScorePenalties { get; set; }
    public int? AwayScorePenalties { get; set; }
    public int? WinnerId { get; set; }

    public League League { get; set; } = null!;
    public Team HomeTeam { get; set; } = null!;
    public Team AwayTeam { get; set; } = null!;
    public Team? Winner { get; set; }
    public ICollection<MatchStatistic> Statistics { get; set; } = [];
    public ICollection<MatchEvent> Events { get; set; } = [];
}
