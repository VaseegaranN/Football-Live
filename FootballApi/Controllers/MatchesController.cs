using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.DTOs;

namespace FootballApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly FootballDbContext _db;

    public MatchesController(FootballDbContext db) => _db = db;

    /// <summary>
    /// GET /api/matches?date=2026-06-22&status=Live
    /// Returns a list of matches, optionally filtered by date and/or status.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<MatchListDto>>> GetMatches(
        [FromQuery] DateOnly? date,
        [FromQuery] string? status)
    {
        var query = _db.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.League)
            .AsQueryable();

        if (date.HasValue)
        {
            var start = date.Value.ToDateTime(TimeOnly.MinValue);
            var end = date.Value.ToDateTime(TimeOnly.MaxValue);
            query = query.Where(m => m.MatchDateTime >= start && m.MatchDateTime <= end);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(m => m.Status == status);
        }

        var matches = await query
            .OrderByDescending(m => m.Status == "Live")
            .ThenBy(m => m.MatchDateTime)
            .Select(m => new MatchListDto(
                m.Id,
                new TeamBriefDto(m.HomeTeam.Id, m.HomeTeam.Name, m.HomeTeam.ShortName, m.HomeTeam.Logo),
                new TeamBriefDto(m.AwayTeam.Id, m.AwayTeam.Name, m.AwayTeam.ShortName, m.AwayTeam.Logo),
                m.HomeScore,
                m.AwayScore,
                m.Status,
                m.Minute,
                m.MatchDateTime,
                m.Venue,
                new LeagueBriefDto(m.League.Id, m.League.Name, m.League.Country, m.League.Logo)
            ))
            .ToListAsync();

        return Ok(matches);
    }

    /// <summary>
    /// GET /api/matches/live
    /// Returns all currently live matches.
    /// </summary>
    [HttpGet("live")]
    public async Task<ActionResult<List<MatchListDto>>> GetLiveMatches()
    {
        var matches = await _db.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.League)
            .Where(m => m.Status == "Live")
            .OrderBy(m => m.MatchDateTime)
            .Select(m => new MatchListDto(
                m.Id,
                new TeamBriefDto(m.HomeTeam.Id, m.HomeTeam.Name, m.HomeTeam.ShortName, m.HomeTeam.Logo),
                new TeamBriefDto(m.AwayTeam.Id, m.AwayTeam.Name, m.AwayTeam.ShortName, m.AwayTeam.Logo),
                m.HomeScore,
                m.AwayScore,
                m.Status,
                m.Minute,
                m.MatchDateTime,
                m.Venue,
                new LeagueBriefDto(m.League.Id, m.League.Name, m.League.Country, m.League.Logo)
            ))
            .ToListAsync();

        return Ok(matches);
    }

    /// <summary>
    /// GET /api/matches/{id}
    /// Returns detailed match info including statistics and events.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<MatchDetailDto>> GetMatch(int id)
    {
        var match = await _db.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.League)
            .Include(m => m.Statistics).ThenInclude(s => s.Team)
            .Include(m => m.Events).ThenInclude(e => e.Player)
            .Include(m => m.Events).ThenInclude(e => e.Team)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match is null)
            return NotFound(new { message = $"Match with id {id} not found." });

        var homeStats = match.Statistics.FirstOrDefault(s => s.TeamId == match.HomeTeamId);
        var awayStats = match.Statistics.FirstOrDefault(s => s.TeamId == match.AwayTeamId);

        var dto = new MatchDetailDto(
            match.Id,
            new TeamBriefDto(match.HomeTeam.Id, match.HomeTeam.Name, match.HomeTeam.ShortName, match.HomeTeam.Logo),
            new TeamBriefDto(match.AwayTeam.Id, match.AwayTeam.Name, match.AwayTeam.ShortName, match.AwayTeam.Logo),
            match.HomeScore,
            match.AwayScore,
            match.Status,
            match.Minute,
            match.MatchDateTime,
            match.Venue,
            new LeagueBriefDto(match.League.Id, match.League.Name, match.League.Country, match.League.Logo),
            homeStats is null ? null : new MatchStatsDto(
                homeStats.Possession, homeStats.ShotsOnTarget, homeStats.ShotsOffTarget,
                homeStats.Fouls, homeStats.Corners, homeStats.YellowCards, homeStats.RedCards,
                homeStats.Passes, homeStats.PassAccuracy),
            awayStats is null ? null : new MatchStatsDto(
                awayStats.Possession, awayStats.ShotsOnTarget, awayStats.ShotsOffTarget,
                awayStats.Fouls, awayStats.Corners, awayStats.YellowCards, awayStats.RedCards,
                awayStats.Passes, awayStats.PassAccuracy),
            match.Events
                .OrderBy(e => e.Minute)
                .Select(e => new MatchEventDto(
                    e.Id, e.EventType, e.Minute, e.Description,
                    e.Player?.Name, e.Team?.Name, e.Team?.ShortName,
                    e.PlayerId))
                .ToList()
        );

        return Ok(dto);
    }

    /// <summary>
    /// PUT /api/matches/{id}
    /// Updates match scores and status with strict knockout stage validations.
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateMatch(int id, [FromBody] UpdateMatchDto dto)
    {
        var match = await _db.Matches.FindAsync(id);
        if (match is null)
            return NotFound(new { message = $"Match with id {id} not found." });

        // Enforce knockout stage validations
        bool isKnockout = !string.IsNullOrWhiteSpace(dto.Stage) && !dto.Stage.StartsWith("Group", StringComparison.OrdinalIgnoreCase);
        
        if (isKnockout && dto.Status == "Finished")
        {
            int finalHome = dto.HomeScoreExtraTime ?? dto.HomeScore;
            int finalAway = dto.AwayScoreExtraTime ?? dto.AwayScore;

            if (finalHome == finalAway)
            {
                // If draw, it MUST have penalties
                if (!dto.HomeScorePenalties.HasValue || !dto.AwayScorePenalties.HasValue)
                {
                    return BadRequest(new { message = "Knockout matches cannot end in a draw. Penalty scores are required when scores are tied." });
                }
                
                if (dto.HomeScorePenalties == dto.AwayScorePenalties)
                {
                    return BadRequest(new { message = "Penalty shootout cannot end in a draw." });
                }
            }

            if (!dto.WinnerId.HasValue)
            {
                return BadRequest(new { message = "Knockout matches must have a resolved WinnerId when finished." });
            }

            if (dto.WinnerId != match.HomeTeamId && dto.WinnerId != match.AwayTeamId)
            {
                return BadRequest(new { message = "WinnerId must correspond to either the Home Team or the Away Team." });
            }
        }

        // Apply updates
        match.HomeScore = dto.HomeScore;
        match.AwayScore = dto.AwayScore;
        match.Status = dto.Status;
        match.Minute = dto.Minute;
        match.Stage = dto.Stage;
        match.HomeScoreExtraTime = dto.HomeScoreExtraTime;
        match.AwayScoreExtraTime = dto.AwayScoreExtraTime;
        match.HomeScorePenalties = dto.HomeScorePenalties;
        match.AwayScorePenalties = dto.AwayScorePenalties;
        match.WinnerId = dto.WinnerId;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
