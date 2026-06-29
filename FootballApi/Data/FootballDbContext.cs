using Microsoft.EntityFrameworkCore;
using FootballApi.Models;

namespace FootballApi.Data;

public class FootballDbContext : DbContext
{
    public FootballDbContext(DbContextOptions<FootballDbContext> options) : base(options) { }

    public DbSet<League> Leagues => Set<League>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Player> Players => Set<Player>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<MatchStatistic> MatchStatistics => Set<MatchStatistic>();
    public DbSet<MatchEvent> MatchEvents => Set<MatchEvent>();
    public DbSet<PlayerSeasonStat> PlayerSeasonStats => Set<PlayerSeasonStat>();
    public DbSet<GroupStanding> GroupStandings => Set<GroupStanding>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // League
        modelBuilder.Entity<League>(e =>
        {
            e.HasKey(l => l.Id);
            e.Property(l => l.Name).HasMaxLength(100).IsRequired();
            e.Property(l => l.Country).HasMaxLength(100).IsRequired();
            e.Property(l => l.Logo).HasMaxLength(500);
        });

        // Team
        modelBuilder.Entity<Team>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Name).HasMaxLength(100).IsRequired();
            e.Property(t => t.ShortName).HasMaxLength(5).IsRequired();
            e.Property(t => t.Logo).HasMaxLength(500);
            e.Property(t => t.Stadium).HasMaxLength(200);
            e.HasOne(t => t.League).WithMany(l => l.Teams).HasForeignKey(t => t.LeagueId);
            e.HasIndex(t => t.LeagueId);
        });

        // Player
        modelBuilder.Entity<Player>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).HasMaxLength(150).IsRequired();
            e.Property(p => p.Position).HasMaxLength(30).IsRequired();
            e.Property(p => p.Nationality).HasMaxLength(100).IsRequired();
            e.Property(p => p.Photo).HasMaxLength(500);
            e.HasOne(p => p.Team).WithMany(t => t.Players).HasForeignKey(p => p.TeamId);
            e.HasIndex(p => p.TeamId);
        });

        // Match
        modelBuilder.Entity<Match>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.Status).HasMaxLength(20).IsRequired().HasDefaultValue("Upcoming");
            e.Property(m => m.Venue).HasMaxLength(200);
            e.HasOne(m => m.League).WithMany(l => l.Matches).HasForeignKey(m => m.LeagueId);
            e.HasOne(m => m.HomeTeam).WithMany().HasForeignKey(m => m.HomeTeamId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(m => m.AwayTeam).WithMany().HasForeignKey(m => m.AwayTeamId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(m => m.Winner).WithMany().HasForeignKey(m => m.WinnerId).OnDelete(DeleteBehavior.NoAction);
            e.HasIndex(m => new { m.Status, m.MatchDateTime });
            e.HasIndex(m => m.HomeTeamId);
            e.HasIndex(m => m.AwayTeamId);
            e.HasIndex(m => m.MatchDateTime);
        });

        // MatchStatistic
        modelBuilder.Entity<MatchStatistic>(e =>
        {
            e.HasKey(ms => ms.Id);
            e.Property(ms => ms.Possession).HasColumnType("decimal(5,2)");
            e.Property(ms => ms.PassAccuracy).HasColumnType("decimal(5,2)");
            e.HasOne(ms => ms.Match).WithMany(m => m.Statistics).HasForeignKey(ms => ms.MatchId);
            e.HasOne(ms => ms.Team).WithMany().HasForeignKey(ms => ms.TeamId).OnDelete(DeleteBehavior.NoAction);
            e.HasIndex(ms => ms.MatchId);
            e.HasIndex(ms => new { ms.MatchId, ms.TeamId }).IsUnique();
        });

        // MatchEvent
        modelBuilder.Entity<MatchEvent>(e =>
        {
            e.HasKey(me => me.Id);
            e.Property(me => me.EventType).HasMaxLength(30).IsRequired();
            e.Property(me => me.Description).HasMaxLength(500);
            e.HasOne(me => me.Match).WithMany(m => m.Events).HasForeignKey(me => me.MatchId);
            e.HasOne(me => me.Team).WithMany().HasForeignKey(me => me.TeamId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(me => me.Player).WithMany().HasForeignKey(me => me.PlayerId).OnDelete(DeleteBehavior.NoAction);
            e.HasIndex(me => me.MatchId);
        });

        // PlayerSeasonStat
        modelBuilder.Entity<PlayerSeasonStat>(e =>
        {
            e.HasKey(ps => ps.Id);
            e.Property(ps => ps.Season).HasMaxLength(10).IsRequired();
            e.Property(ps => ps.Rating).HasColumnType("decimal(3,1)");
            e.HasOne(ps => ps.Player).WithMany(p => p.SeasonStats).HasForeignKey(ps => ps.PlayerId);
            e.HasIndex(ps => ps.PlayerId);
            e.HasIndex(ps => new { ps.PlayerId, ps.Season }).IsUnique();
        });

        // GroupStanding
        modelBuilder.Entity<GroupStanding>(e =>
        {
            e.HasKey(gs => gs.Id);
            e.Property(gs => gs.GroupName).HasMaxLength(50).IsRequired();
            e.HasOne(gs => gs.League).WithMany(l => l.GroupStandings).HasForeignKey(gs => gs.LeagueId);
            e.HasOne(gs => gs.Team).WithMany().HasForeignKey(gs => gs.TeamId).OnDelete(DeleteBehavior.NoAction);
            e.HasIndex(gs => new { gs.LeagueId, gs.GroupName });
            e.HasIndex(gs => new { gs.LeagueId, gs.TeamId }).IsUnique();
        });
    }
}
