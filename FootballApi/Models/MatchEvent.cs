namespace FootballApi.Models;

public class MatchEvent
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public int? TeamId { get; set; }
    public int? PlayerId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public int Minute { get; set; }
    public string? Description { get; set; }

    public Match Match { get; set; } = null!;
    public Team? Team { get; set; }
    public Player? Player { get; set; }
}
