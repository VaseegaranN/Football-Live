using Microsoft.EntityFrameworkCore;
using FootballApi.Data;
using FootballApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Services ───────────────────────────────────────────────────────────────────

// EF Core with SQL Server
builder.Services.AddDbContext<FootballDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(3)
    ));

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// OpenAPI / Swagger
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// SignalR & Background Service
builder.Services.AddSignalR();
builder.Services.AddHostedService<WorldCupSyncWorker>();

// CORS for React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ─── Middleware Pipeline ────────────────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ScorePulse API v1");
    });
}

app.UseCors("ReactDev");

app.MapGet("/", () => Results.Content(@"
    <!DOCTYPE html>
    <html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <title>ScorePulse API - Sports Hub</title>
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background-color: #0f172a;
                color: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
            .card {
                background: rgba(30, 41, 59, 0.8);
                border: 1px solid rgba(148, 163, 184, 0.1);
                border-radius: 16px;
                padding: 32px;
                max-width: 450px;
                width: 100%;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                text-align: center;
            }
            h1 {
                color: #10b981;
                font-size: 28px;
                margin-top: 0;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            p {
                color: #94a3b8;
                font-size: 14px;
                margin-bottom: 24px;
            }
            .endpoints {
                list-style: none;
                padding: 0;
                margin: 0;
                text-align: left;
            }
            .endpoints li {
                background: #1e293b;
                margin-bottom: 8px;
                padding: 10px 14px;
                border-radius: 8px;
                border: 1px solid #334155;
                font-size: 13px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .endpoints a {
                color: #3b82f6;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.2s;
            }
            .endpoints a:hover {
                color: #10b981;
            }
            .method {
                font-weight: 800;
                font-size: 10px;
                color: #10b981;
                background: rgba(16, 185, 129, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class=""card"">
            <h1>⚽ ScorePulse API</h1>
            <p>The .NET 10 Football Scores & Statistics Web API is running successfully.</p>
            <ul class=""endpoints"">
                <li>
                    <span><span class=""method"">GET</span> /api/matches</span>
                    <a href=""/api/matches"">Browse</a>
                </li>
                <li>
                    <span><span class=""method"">GET</span> /api/matches/live</span>
                    <a href=""/api/matches/live"">Browse</a>
                </li>
                <li>
                    <span><span class=""method"">GET</span> /api/leagues</span>
                    <a href=""/api/leagues"">Browse</a>
                </li>
                <li>
                    <span><span class=""method"" style=""background: rgba(59, 130, 246, 0.1); color: #3b82f6;"">UI</span> /swagger</span>
                    <a href=""/swagger"">Open UI</a>
                </li>
                <li>
                    <span><span class=""method"">GET</span> /openapi/v1.json</span>
                    <a href=""/openapi/v1.json"">Open Spec</a>
                </li>
            </ul>
        </div>
    </body>
    </html>
", "text/html"));

app.MapHub<FootballApi.Hubs.MatchHub>("/matchHub");

app.MapControllers();

app.Run();
