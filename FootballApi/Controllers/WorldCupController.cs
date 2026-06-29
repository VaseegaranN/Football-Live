using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.DTOs;
using FootballApi.Models;

namespace FootballApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorldCupController : ControllerBase
{
    private readonly FootballDbContext _db;

    public WorldCupController(FootballDbContext db) => _db = db;

    /// <summary>
    /// GET /api/worldcup/standings?leagueId=5
    /// Returns the group standings for a tournament, sorted by FIFA tie-breaker rules.
    /// </summary>
    [HttpGet("standings")]
    public async Task<ActionResult<Dictionary<string, List<GroupStandingDto>>>> GetStandings([FromQuery] int leagueId = 5)
    {
        var standings = await _db.GroupStandings
            .Include(gs => gs.Team)
            .Where(gs => gs.LeagueId == leagueId)
            .ToListAsync();

        if (standings.Count == 0)
        {
            return NotFound(new { message = $"No standings found for tournament league {leagueId}." });
        }

        // Fetch all group matches in this league to evaluate Head-to-Head fallback
        var groupMatches = await _db.Matches
            .Where(m => m.LeagueId == leagueId && m.Stage != null && m.Stage.StartsWith("Group") && m.Status == "Finished")
            .ToListAsync();

        // Group by GroupName and sort each group using FIFA rules
        var groupedStandings = standings
            .GroupBy(gs => gs.GroupName)
            .ToDictionary(
                g => g.Key,
                g => SortGroupStandings(g.ToList(), groupMatches)
            );

        return Ok(groupedStandings);
    }

    /// <summary>
    /// GET /api/worldcup/bracket?leagueId=5
    /// Returns the knockout stages and matches sorted sequentially for the bracket tree.
    /// </summary>
    [HttpGet("bracket")]
    public async Task<ActionResult<List<BracketRoundDto>>> GetBracket([FromQuery] int leagueId = 5)
    {
        var matches = await _db.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Where(m => m.LeagueId == leagueId && m.Stage != null && !m.Stage.StartsWith("Group"))
            .ToListAsync();

        // Sequential knockout stages order
        var stageOrder = new List<string> { "Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals", "Final" };

        var bracket = matches
            .GroupBy(m => m.Stage!)
            .Select(g => new BracketRoundDto(
                g.Key,
                g.Select(m => new BracketMatchDto(
                    m.Id,
                    new TeamBriefDto(m.HomeTeam.Id, m.HomeTeam.Name, m.HomeTeam.ShortName, m.HomeTeam.Logo),
                    new TeamBriefDto(m.AwayTeam.Id, m.AwayTeam.Name, m.AwayTeam.ShortName, m.AwayTeam.Logo),
                    m.HomeScore,
                    m.AwayScore,
                    m.Status,
                    m.Minute,
                    m.MatchDateTime,
                    m.Venue,
                    m.Stage!,
                    m.HomeScoreExtraTime,
                    m.AwayScoreExtraTime,
                    m.HomeScorePenalties,
                    m.AwayScorePenalties,
                    m.WinnerId
                )).ToList()
            ))
            .OrderBy(r => stageOrder.IndexOf(r.RoundName) == -1 ? 99 : stageOrder.IndexOf(r.RoundName))
            .ToList();

        return Ok(bracket);
    }

    private List<GroupStandingDto> SortGroupStandings(List<GroupStanding> groupList, List<Match> groupMatches)
    {
        groupList.Sort((a, b) =>
        {
            // 1. Points (descending)
            int compare = b.Points.CompareTo(a.Points);
            if (compare != 0) return compare;

            // 2. Goal Difference (descending)
            int aGD = a.GoalsFor - a.GoalsAgainst;
            int bGD = b.GoalsFor - b.GoalsAgainst;
            compare = bGD.CompareTo(aGD);
            if (compare != 0) return compare;

            // 3. Goals Scored (descending)
            compare = b.GoalsFor.CompareTo(a.GoalsFor);
            if (compare != 0) return compare;

            // 4. Head-to-Head record between the two tied teams
            var h2hMatch = groupMatches.FirstOrDefault(m =>
                (m.HomeTeamId == a.TeamId && m.AwayTeamId == b.TeamId) ||
                (m.HomeTeamId == b.TeamId && m.AwayTeamId == a.TeamId));

            if (h2hMatch != null)
            {
                if (h2hMatch.HomeTeamId == a.TeamId)
                {
                    // A is home
                    if (h2hMatch.HomeScore > h2hMatch.AwayScore) return -1; // A won (A should be placed before B)
                    if (h2hMatch.AwayScore > h2hMatch.HomeScore) return 1;  // B won (B should be placed before A)
                }
                else
                {
                    // B is home
                    if (h2hMatch.HomeScore > h2hMatch.AwayScore) return 1;  // B won
                    if (h2hMatch.AwayScore > h2hMatch.HomeScore) return -1; // A won
                }
            }

            // 5. Fallback to Team Name alphabetically
            return string.Compare(a.Team.Name, b.Team.Name, System.StringComparison.Ordinal);
        });

        return groupList.Select(gs => new GroupStandingDto(
            gs.GroupName,
            new TeamBriefDto(gs.Team.Id, gs.Team.Name, gs.Team.ShortName, gs.Team.Logo),
            gs.Played,
            gs.Won,
            gs.Drawn,
            gs.Lost,
            gs.GoalsFor,
            gs.GoalsAgainst,
            gs.Points,
            gs.GoalsFor - gs.GoalsAgainst
        )).ToList();
    }
}
