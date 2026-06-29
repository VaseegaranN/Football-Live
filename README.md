# ⚽ ScorePulse - Football Live Scores & Tournament Bracket Manager

ScorePulse is a modern, real-time sports dashboard application built using a decoupled client-server architecture. It features live scores, news tickers, real-time match events, player profiles, and a dynamic FIFA World Cup knockout tournament bracket.

---

## 🏗️ Architecture

The project consists of three main components:
1. **Frontend (`football-client`)**: A single-page application (SPA) built with React 19, Vite, Tailwind CSS, Lucide Icons, Axios, and Microsoft SignalR client.
2. **Backend (`FootballApi`)**: A C# ASP.NET Core Web API built on .NET 10, utilizing Entity Framework Core (EF Core) for data access, SignalR for real-time WebSocket communication, and a hosted background sync service.
3. **Database (`Database`)**: SQL Server database schemas and seeding scripts containing sample player profiles, match schedules, and real-time event logs.

---

## 🚀 Key Features

- **Real-Time Score Streams**: Scores and match statistics update in real-time without reloading, driven by SignalR web socket hubs.
- **Match Events Timeline**: Visualizes goals, substitutions, yellow/red cards, and penalty updates sequentially.
- **Dynamic Tournament Bracket**: Interactive FIFA World Cup bracket showing knockout stages (Round of 16, Quarter-finals, Semi-finals, and Finals).
- **Player & Team Info**: Interactive hover cards displaying key stats (appearances, goals, clean sheets, match heatmaps, and rating overviews).
- **Dark/Light Mode Theme**: Polished dark-mode-first aesthetic with a responsive toggle supporting custom CSS variables.

---

## ⚙️ Local Development Setup

### 1. Database Setup
The backend is configured to connect to a local Microsoft SQL Server instance (SQLExpress).

1. Ensure SQL Server (or SQL Express) is running on your machine.
2. Open SQL Server Management Studio (SSMS) or your preferred SQL editor.
3. Create a database named `FootballLiveScores`.
4. Execute the following SQL files located in the `Database/` directory in order:
   - [schema.sql](file:///c:/Users/admin/Documents/Claude/ReactNew/FootBall/Database/schema.sql) — Creates tables, indexes, and foreign keys.
   - [seed.sql](file:///c:/Users/admin/Documents/Claude/ReactNew/FootBall/Database/seed.sql) — Inserts initial teams, players, and leagues.
   - [seed_worldcup.sql](file:///c:/Users/admin/Documents/Claude/ReactNew/FootBall/Database/seed_worldcup.sql) — Populates World Cup matches, tournament brackets, and team standings.

### 2. Run the Backend API (`FootballApi`)
1. Navigate to the `FootballApi` directory:
   ```bash
   cd FootballApi
   ```
2. Check `appsettings.json` and verify the `DefaultConnection` string points to your SQL Server instance:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.\\SQLEXPRESS;Database=FootballLiveScores;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```
3. Run the .NET API application:
   ```bash
   dotnet run
   ```
4. The backend API will start on:
   - HTTP: `http://localhost:5000`
   - HTTPS: `https://localhost:5001`
   - Swagger Documentation: `http://localhost:5000/swagger`

### 3. Run the Frontend Client (`football-client`)
1. Navigate to the `football-client` directory:
   ```bash
   cd football-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`. The Vite server automatically proxies `/api` requests to the backend on `http://localhost:5000`.

---

## 🌐 Production Deployment

### Deployed Frontend
The static React client is built and deployed to **GitHub Pages** using an automated GitHub Actions CI/CD workflow:
🔗 **Live URL**: [https://vaseegarann.github.io/Football-Live/](https://vaseegarann.github.io/Football-Live/)

### GitHub Actions Workflow
The workflow is defined in [.github/workflows/deploy.yml](file:///c:/Users/admin/Documents/Claude/ReactNew/FootBall/.github/workflows/deploy.yml). It builds the static assets and deploys them to GitHub Pages every time you push to the `main` or `master` branches.

### Environment Variables
By default, the deployed production build runs in client-only fallback mode unless pointed to a publicly hosted backend API.
- Set the environment variable `VITE_API_BASE_URL` in the deployment workflow to your publicly hosted C# backend API (e.g. `https://your-api.azurewebsites.net`).
- If no environment variable is provided, the API requests fall back to local dev configurations.

### CORS Setup
The backend `Program.cs` file is pre-configured to allow CORS requests from the GitHub Pages host:
```csharp
policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "https://vaseegarann.github.io")
```
If you deploy your C# API to a cloud service (Azure, Render, Railway, etc.), ensure you configure it to run on HTTPS to avoid browser "Mixed Content" security restrictions (which block secure HTTPS sites from making requests to insecure HTTP backends).
