import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
});

// Create tables
const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT false,
        score INTEGER DEFAULT 0,
        time_taken INTEGER,
        mistakes INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        achievement_type TEXT NOT NULL,
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, achievement_type)
      );

      CREATE TABLE IF NOT EXISTS user_purchases (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        item_id TEXT NOT NULL,
        purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, item_id)
      );

      CREATE TABLE IF NOT EXISTS user_customizations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        customization_type TEXT NOT NULL,
        item_id TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, customization_type)
      );

      CREATE TABLE IF NOT EXISTS user_boosters (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        booster_type TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, booster_type)
      );

      CREATE TABLE IF NOT EXISTS daily_challenges (
        id SERIAL PRIMARY KEY,
        challenge_date DATE NOT NULL UNIQUE,
        challenge_type TEXT NOT NULL,
        challenge_data TEXT NOT NULL,
        points_reward INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_daily_completions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        challenge_id INTEGER NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time_taken INTEGER,
        score INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id),
        UNIQUE(user_id, challenge_id)
      );

      CREATE TABLE IF NOT EXISTS user_streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity_date DATE,
        streak_freeze_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS leaderboard_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        total_score INTEGER DEFAULT 0,
        total_lessons_completed INTEGER DEFAULT 0,
        average_score REAL DEFAULT 0,
        total_achievements INTEGER DEFAULT 0,
        fastest_lesson_time INTEGER,
        perfect_lessons INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id)
      );

      CREATE TABLE IF NOT EXISTS weekly_leaderboard (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        week_start DATE NOT NULL,
        weekly_score INTEGER DEFAULT 0,
        weekly_lessons INTEGER DEFAULT 0,
        weekly_achievements INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, week_start)
      );

      CREATE TABLE IF NOT EXISTS lesson_leaderboard (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        lesson_id INTEGER NOT NULL,
        best_time INTEGER NOT NULL,
        best_score INTEGER NOT NULL,
        attempts INTEGER DEFAULT 1,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, lesson_id)
      );
    `);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database
createTables().catch(console.error);

export default pool;
