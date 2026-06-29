namespace FootballApi.Models;

public class League
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public bool IsTournament { get; set; }
    public string? CurrentStage { get; set; }

    public ICollection<Team> Teams { get; set; } = [];
    public ICollection<Match> Matches { get; set; } = [];
    public ICollection<GroupStanding> GroupStandings { get; set; } = [];
}
