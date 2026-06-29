using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.DTOs;

namespace FootballApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly FootballDbContext _db;

    public TeamsController(FootballDbContext db) => _db = db;

    /// <summary>
    /// GET /api/teams/{id}
    /// Returns team info with roster.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeamDetailDto>> GetTeam(int id)
    {
        var team = await _db.Teams
            .Include(t => t.League)
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team is null)
            return NotFound(new { message = $"Team with id {id} not found." });

        var dto = new TeamDetailDto(
            team.Id,
            team.Name,
            team.ShortName,
            team.Logo,
            team.Stadium,
            new LeagueBriefDto(team.League.Id, team.League.Name, team.League.Country, team.League.Logo),
            team.Players
                .OrderBy(p => p.Position)
                .ThenBy(p => p.Number)
                .Select(p => new PlayerBriefDto(p.Id, p.Name, p.Position, p.Number, p.Nationality))
                .ToList()
        );

        return Ok(dto);
    }
}
