using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.Hubs;
using FootballApi.DTOs;
using FootballApi.Models;

namespace FootballApi.Services;

public class WorldCupSyncWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<MatchHub> _hubContext;
    private readonly ILogger<WorldCupSyncWorker> _logger;
    private readonly Random _random = new();

    public WorldCupSyncWorker(
        IServiceScopeFactory scopeFactory,
        IHubContext<MatchHub> hubContext,
        ILogger<WorldCupSyncWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("World Cup Sync Worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<FootballDbContext>();

                await ProcessLiveMatchesAsync(db, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in World Cup Sync Worker.");
            }

            await Task.Delay(10000, stoppingToken); // Run every 10 seconds
        }
    }

    private async Task ProcessLiveMatchesAsync(FootballDbContext db, CancellationToken ct)
    {
        var liveMatches = await db.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.League)
            .Where(m => m.Status == "Live" || m.Status == "LiveExtraTime" || m.Status == "LivePenalties")
            .ToListAsync(ct);

        if (liveMatches.Count == 0) return;

        foreach (var match in liveMatches)
        {
            // 1. Advance time / minutes
            if (match.Status == "Live")
            {
                match.Minute = (match.Minute ?? 0) + 1;
                
                // Simulate goal occurrence (5% chance per tick)
                if (_random.NextDouble() < 0.05)
                {
                    bool isHome = _random.Next(2) == 0;
                    if (isHome) match.HomeScore++; else match.AwayScore++;

                    var team = isHome ? match.HomeTeam : match.AwayTeam;
                    var description = $"{team.Name} scores! A magnificent strike.";
                    await AddEventAsync(db, match.Id, team.Id, "Goal", match.Minute ?? 90, description, ct);
                }

                if (match.Minute >= 90)
                {
                    // If knockout stage and draw -> transition to Extra Time
                    bool isKnockout = match.Stage != null && !match.Stage.StartsWith("Group");
                    if (isKnockout && match.HomeScore == match.AwayScore)
                    {
                        match.Status = "LiveExtraTime";
                        match.Minute = 90;
                        match.HomeScoreExtraTime = match.HomeScore;
                        match.AwayScoreExtraTime = match.AwayScore;
                        await AddEventAsync(db, match.Id, null, "HalfTime", 90, "Full-time draw! We are going into Extra Time.", ct);
                    }
                    else
                    {
                        match.Status = "Finished";
                        match.WinnerId = match.HomeScore > match.AwayScore ? match.HomeTeamId : (match.AwayScore > match.HomeScore ? match.AwayTeamId : null);
                        await AddEventAsync(db, match.Id, null, "HalfTime", 90, $"Match finished! Final score: {match.HomeScore}-{match.AwayScore}", ct);
                        
                        if (match.League.IsTournament && !isKnockout)
                        {
                            await UpdateGroupStandingsAsync(db, match, ct);
                        }
                    }
                }
            }
            else if (match.Status == "LiveExtraTime")
            {
                match.Minute = (match.Minute ?? 90) + 1;

                // Simulate Extra Time Goal (4% chance)
                if (_random.NextDouble() < 0.04)
                {
                    bool isHome = _random.Next(2) == 0;
                    if (isHome) match.HomeScoreExtraTime++; else match.AwayScoreExtraTime++;

                    var team = isHome ? match.HomeTeam : match.AwayTeam;
                    var description = $"{team.Name} scores in Extra Time! Clutch goal!";
                    await AddEventAsync(db, match.Id, team.Id, "Goal", match.Minute ?? 120, description, ct);
                }

                if (match.Minute >= 120)
                {
                    if (match.HomeScoreExtraTime == match.AwayScoreExtraTime)
                    {
                        match.Status = "LivePenalties";
                        match.HomeScorePenalties = 0;
                        match.AwayScorePenalties = 0;
                        await AddEventAsync(db, match.Id, null, "Comment", 120, "Extra Time ends in a draw. The match goes to a Penalty Shootout!", ct);
                    }
                    else
                    {
                        match.Status = "Finished";
                        match.WinnerId = match.HomeScoreExtraTime > match.AwayScoreExtraTime ? match.HomeTeamId : match.AwayTeamId;
                        await AddEventAsync(db, match.Id, null, "HalfTime", 120, $"Match finished AET! Final score: {match.HomeScoreExtraTime}-{match.AwayScoreExtraTime}", ct);
                    }
                }
            }
            else if (match.Status == "LivePenalties")
            {
                // Simulate penalty kicks
                match.HomeScorePenalties = (match.HomeScorePenalties ?? 0) + (_random.Next(10) < 8 ? 1 : 0);
                match.AwayScorePenalties = (match.AwayScorePenalties ?? 0) + (_random.Next(10) < 8 ? 1 : 0);

                // Check if shootout finishes (simulate quick completion after shootout is established)
                if (_random.NextDouble() < 0.3 && match.HomeScorePenalties != match.AwayScorePenalties)
                {
                    match.Status = "Finished";
                    match.WinnerId = match.HomeScorePenalties > match.AwayScorePenalties ? match.HomeTeamId : match.AwayTeamId;
                    await AddEventAsync(db, match.Id, null, "Comment", 121, $"Penalties finish! Shootout score: {match.HomeScorePenalties}-{match.AwayScorePenalties}. Winner: {(match.WinnerId == match.HomeTeamId ? match.HomeTeam.Name : match.AwayTeam.Name)}", ct);
                }
            }

            await db.SaveChangesAsync(ct);

            // Broadcast to SignalR Clients
            var listDto = new MatchListDto(
                match.Id,
                new TeamBriefDto(match.HomeTeam.Id, match.HomeTeam.Name, match.HomeTeam.ShortName, match.HomeTeam.Logo),
                new TeamBriefDto(match.AwayTeam.Id, match.AwayTeam.Name, match.AwayTeam.ShortName, match.AwayTeam.Logo),
                match.HomeScore,
                match.AwayScore,
                match.Status,
                match.Minute,
                match.MatchDateTime,
                match.Venue,
                new LeagueBriefDto(match.League.Id, match.League.Name, match.League.Country, match.League.Logo, match.League.IsTournament, match.League.CurrentStage),
                match.Stage,
                match.HomeScoreExtraTime,
                match.AwayScoreExtraTime,
                match.HomeScorePenalties,
                match.AwayScorePenalties,
                match.WinnerId
            );

            await _hubContext.Clients.All.SendAsync("ReceiveMatchUpdate", listDto, ct);
            await _hubContext.Clients.Group($"Match_{match.Id}").SendAsync("ReceiveDetailedMatchUpdate", listDto, ct);
        }
    }

    private async Task AddEventAsync(FootballDbContext db, int matchId, int? teamId, string eventType, int minute, string description, CancellationToken ct)
    {
        var matchEvent = new MatchEvent
        {
            MatchId = matchId,
            TeamId = teamId,
            EventType = eventType,
            Minute = minute,
            Description = description
        };
        db.MatchEvents.Add(matchEvent);
        await db.SaveChangesAsync(ct);
    }

    private async Task UpdateGroupStandingsAsync(FootballDbContext db, Match match, CancellationToken ct)
    {
        var homeStanding = await db.GroupStandings.FirstOrDefaultAsync(gs => gs.LeagueId == match.LeagueId && gs.TeamId == match.HomeTeamId, ct);
        var awayStanding = await db.GroupStandings.FirstOrDefaultAsync(gs => gs.LeagueId == match.LeagueId && gs.TeamId == match.AwayTeamId, ct);

        if (homeStanding == null || awayStanding == null) return;

        homeStanding.Played++;
        awayStanding.Played++;

        homeStanding.GoalsFor += match.HomeScore;
        homeStanding.GoalsAgainst += match.AwayScore;
        awayStanding.GoalsFor += match.AwayScore;
        awayStanding.GoalsAgainst += match.HomeScore;

        if (match.HomeScore > match.AwayScore)
        {
            homeStanding.Won++;
            homeStanding.Points += 3;
            awayStanding.Lost++;
        }
        else if (match.AwayScore > match.HomeScore)
        {
            awayStanding.Won++;
            awayStanding.Points += 3;
            homeStanding.Lost++;
        }
        else
        {
            homeStanding.Drawn++;
            homeStanding.Points += 1;
            awayStanding.Drawn++;
            awayStanding.Points += 1;
        }

        await db.SaveChangesAsync(ct);
    }
}
