namespace FootballApi.Models;

public class Player
{
    public int Id { get; set; }
    public int TeamId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int? Number { get; set; }
    public string Nationality { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string? Photo { get; set; }

    public Team Team { get; set; } = null!;
    public ICollection<PlayerSeasonStat> SeasonStats { get; set; } = [];
}
