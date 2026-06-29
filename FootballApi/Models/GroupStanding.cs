namespace FootballApi.Models;

public class GroupStanding
{
    public int Id { get; set; }
    public int LeagueId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public int TeamId { get; set; }
    public int Played { get; set; }
    public int Won { get; set; }
    public int Drawn { get; set; }
    public int Lost { get; set; }
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }
    public int Points { get; set; }

    public League League { get; set; } = null!;
    public Team Team { get; set; } = null!;
}
