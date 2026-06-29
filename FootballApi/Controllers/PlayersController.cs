using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.DTOs;

namespace FootballApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly FootballDbContext _db;

    public PlayersController(FootballDbContext db) => _db = db;

    /// <summary>
    /// GET /api/players/{id}
    /// Returns player profile with team info and season statistics.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PlayerProfileDto>> GetPlayer(int id)
    {
        var player = await _db.Players
            .Include(p => p.Team)
            .Include(p => p.SeasonStats)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player is null)
            return NotFound(new { message = $"Player with id {id} not found." });

        var dto = new PlayerProfileDto(
            player.Id,
            player.Name,
            player.Position,
            player.Number,
            player.Nationality,
            player.DateOfBirth,
            player.Photo ?? $"https://api.dicebear.com/7.x/adventurer/svg?seed={System.Uri.EscapeDataString(player.Name)}",
            new TeamBriefDto(player.Team.Id, player.Team.Name, player.Team.ShortName, player.Team.Logo),
            player.SeasonStats
                .OrderByDescending(s => s.Season)
                .Select(s => new SeasonStatDto(
                    s.Season, s.Goals, s.Assists, s.YellowCards, s.RedCards,
                    s.MatchesPlayed, s.MinutesPlayed, s.Rating))
                .ToList()
        );

        return Ok(dto);
    }

    /// <summary>
    /// GET /api/players/search?q=Saka
    /// Search players by name.
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<List<PlayerBriefDto>>> SearchPlayers([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            return BadRequest(new { message = "Search query must be at least 2 characters." });

        var players = await _db.Players
            .Where(p => EF.Functions.Like(p.Name, $"%{q}%"))
            .OrderBy(p => p.Name)
            .Take(20)
            .Select(p => new PlayerBriefDto(p.Id, p.Name, p.Position, p.Number, p.Nationality))
            .ToListAsync();

        return Ok(players);
    }
}
