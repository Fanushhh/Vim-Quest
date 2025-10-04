# PostgreSQL Database Setup Guide

This application uses PostgreSQL for persistent data storage. Follow these steps to set up your database.

## Local Development

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE vim_quest;

# Exit
\q
```

### 3. Set Environment Variable

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://localhost:5432/vim_quest
```

Or with credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/vim_quest
```

### 4. Run the Server

Tables will be created automatically when the server starts:

```bash
npm install
npm start
```

## Production Deployment (Render)

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** ’ **PostgreSQL**
3. Fill in the details:
   - **Name**: `vim-quest-db` (or your preferred name)
   - **Database**: `vim_quest`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your web service
   - **PostgreSQL Version**: 15 or later
   - **Plan**: Free (or paid for production)
4. Click **Create Database**

### 2. Get Database Connection String

1. Once created, go to your PostgreSQL database dashboard
2. Scroll down to **Connections** section
3. Copy the **Internal Database URL** (if web service is on Render) or **External Database URL**
4. It will look like:
   ```
   postgresql://vim_quest_user:abc123...@dpg-xxxxx.oregon-postgres.render.com/vim_quest
   ```

### 3. Add Environment Variable to Web Service

1. Go to your web service on Render
2. Navigate to **Environment** tab
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: (paste the database URL from step 2)
4. Click **Save Changes**

### 4. Deploy

Your web service will automatically redeploy with the new database connection. Tables will be created automatically on first run.

## Database Tables

The following tables are created automatically:

- **users** - User accounts and authentication
- **progress** - User lesson progress and scores
- **achievements** - Unlocked achievements
- **user_purchases** - Store purchases
- **user_customizations** - Avatar/theme customizations
- **user_boosters** - Active boosters
- **daily_challenges** - Daily challenge definitions
- **user_daily_completions** - User challenge completions
- **user_streaks** - User activity streaks
- **leaderboard_entries** - Global leaderboard
- **weekly_leaderboard** - Weekly leaderboard
- **lesson_leaderboard** - Per-lesson leaderboard

## Managing Your Database

### Using psql (Command Line)

```bash
# Connect to database
psql $DATABASE_URL

# List all tables
\dt

# View table structure
\d users

# Query data
SELECT * FROM users;

# Exit
\q
```

### Using GUI Tools

Recommended tools for PostgreSQL management:

1. **pgAdmin** - Free, full-featured ([Download](https://www.pgadmin.org/))
2. **DBeaver** - Free, multi-database ([Download](https://dbeaver.io/))
3. **TablePlus** - Paid, beautiful UI ([Download](https://tableplus.com/))
4. **Postico** - macOS only, paid ([Download](https://eggerapps.at/postico/))

### Connecting with GUI Tools

Use your `DATABASE_URL` or individual connection details:
- **Host**: From your connection string
- **Port**: 5432 (default)
- **Database**: `vim_quest`
- **Username**: From your connection string
- **Password**: From your connection string

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Check `DATABASE_URL` is correctly set
2. Ensure PostgreSQL is running (local dev)
3. Check firewall settings
4. Verify database credentials

### Table Creation Issues

If tables aren't being created:

1. Check server logs for errors
2. Ensure database user has CREATE permissions
3. Manually run the CREATE TABLE statements from `database.js`

### Migration from SQLite

If you have existing SQLite data and want to migrate:

1. Export data from SQLite
2. Transform to PostgreSQL format
3. Import using `COPY` or `INSERT` statements

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `NODE_ENV` | Environment (development/production) | `production` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `PORT` | Server port | `3001` |
| `CLIENT_URL` | Frontend URL for CORS | `https://vim-quest.onrender.com` |
