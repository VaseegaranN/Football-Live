namespace FootballApi.Models;

public class MatchStatistic
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public int TeamId { get; set; }
    public decimal Possession { get; set; }
    public int ShotsOnTarget { get; set; }
    public int ShotsOffTarget { get; set; }
    public int Fouls { get; set; }
    public int Corners { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
    public int Passes { get; set; }
    public decimal PassAccuracy { get; set; }

    public Match Match { get; set; } = null!;
    public Team Team { get; set; } = null!;
}
