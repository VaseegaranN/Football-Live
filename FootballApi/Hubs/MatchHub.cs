using Microsoft.AspNetCore.SignalR;

namespace FootballApi.Hubs;

public class MatchHub : Hub
{
    public async Task JoinMatch(string matchId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Match_{matchId}");
    }

    public async Task LeaveMatch(string matchId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Match_{matchId}");
    }
}
