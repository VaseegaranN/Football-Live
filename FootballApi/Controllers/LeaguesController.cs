using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.DTOs;

namespace FootballApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaguesController : ControllerBase
{
    private readonly FootballDbContext _db;

    public LeaguesController(FootballDbContext db) => _db = db;

    /// <summary>
    /// GET /api/leagues
    /// Returns all leagues.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<LeagueBriefDto>>> GetLeagues()
    {
        var leagues = await _db.Leagues
            .OrderBy(l => l.Name)
            .Select(l => new LeagueBriefDto(l.Id, l.Name, l.Country, l.Logo))
            .ToListAsync();

        return Ok(leagues);
    }
}
