namespace FootballApi.Models;

public class Team
{
    public int Id { get; set; }
    public int LeagueId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Stadium { get; set; }

    public League League { get; set; } = null!;
    public ICollection<Player> Players { get; set; } = [];
}
