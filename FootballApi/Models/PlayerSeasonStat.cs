namespace FootballApi.Models;

public class PlayerSeasonStat
{
    public int Id { get; set; }
    public int PlayerId { get; set; }
    public string Season { get; set; } = string.Empty;
    public int Goals { get; set; }
    public int Assists { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
    public int MatchesPlayed { get; set; }
    public int MinutesPlayed { get; set; }
    public decimal Rating { get; set; }

    public Player Player { get; set; } = null!;
}
