import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'vim-quest-secret-key-change-in-production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration - allow both local and production origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://vim-quest.onrender.com',
  CLIENT_URL
].filter((origin, index, self) => self.indexOf(origin) === index); // Remove duplicates

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    const token = jwt.sign({ id: result.rows[0].id, username }, JWT_SECRET);
    res.json({ token, username });
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM progress WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save lesson progress
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { lessonId, completed, score, timeTaken, mistakes } = req.body;

    await pool.query(`
      INSERT INTO progress (user_id, lesson_id, completed, score, time_taken, mistakes, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, lesson_id)
      DO UPDATE SET completed = $3, score = $4, time_taken = $5, mistakes = $6, completed_at = CURRENT_TIMESTAMP
    `, [req.user.id, lessonId, completed, score, timeTaken, mistakes]);

    // Update leaderboard and streak if lesson is completed
    if (completed) {
      await updateLeaderboard(req.user.id, req.user.username, {
        lessonId,
        score,
        timeTaken,
        mistakes
      });
      await updateUserStreak(req.user.id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get achievements
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM achievements WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlock achievement
app.post('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const { achievementType } = req.body;

    await pool.query(`
      INSERT INTO achievements (user_id, achievement_type)
      VALUES ($1, $2)
      ON CONFLICT (user_id, achievement_type) DO NOTHING
    `, [req.user.id, achievementType]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user purchases
app.get('/api/purchases', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT item_id FROM user_purchases WHERE user_id = $1', [req.user.id]);
    res.json(result.rows.map(p => p.item_id));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save purchase
app.post('/api/purchases', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.body;

    await pool.query(`
      INSERT INTO user_purchases (user_id, item_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, item_id) DO NOTHING
    `, [req.user.id, itemId]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user customizations
app.get('/api/customizations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT customization_type, item_id FROM user_customizations WHERE user_id = $1',
      [req.user.id]
    );

    const customizations = {};
    result.rows.forEach(c => {
      customizations[c.customization_type] = c.item_id;
    });

    res.json(customizations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save customizations
app.post('/api/customizations', authenticateToken, async (req, res) => {
  try {
    const { customizationType, itemId } = req.body;

    await pool.query(`
      INSERT INTO user_customizations (user_id, customization_type, item_id, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, customization_type)
      DO UPDATE SET item_id = $3, updated_at = CURRENT_TIMESTAMP
    `, [req.user.id, customizationType, itemId]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user boosters
app.get('/api/boosters', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT booster_type, value FROM user_boosters WHERE user_id = $1', [req.user.id]);

    const boosters = {};
    result.rows.forEach(b => {
      boosters[b.booster_type] = JSON.parse(b.value);
    });

    res.json(boosters);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save boosters
app.post('/api/boosters', authenticateToken, async (req, res) => {
  try {
    const { boosterType, value } = req.body;

    const jsonValue = JSON.stringify(value);
    await pool.query(`
      INSERT INTO user_boosters (user_id, booster_type, value, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, booster_type)
      DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP
    `, [req.user.id, boosterType, jsonValue]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Daily challenge types
const challengeTypes = [
  { type: 'speed_run', name: 'Speed Run', description: 'Complete any lesson in under 45 seconds' },
  { type: 'perfect_lesson', name: 'Perfect Performance', description: 'Complete any lesson with 0 mistakes' },
  { type: 'specific_lesson', name: 'Master This Lesson', description: 'Complete a specific lesson' },
  { type: 'high_score', name: 'Score Champion', description: 'Achieve a score of 95+ on any lesson' },
  { type: 'three_lessons', name: 'Triple Play', description: 'Complete 3 different lessons today' }
];

// Get or create today's daily challenge
app.get('/api/daily-challenge', authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if today's challenge exists
    let challengeResult = await pool.query('SELECT * FROM daily_challenges WHERE challenge_date = $1', [today]);
    let challenge = challengeResult.rows[0];

    // If no challenge for today, create one
    if (!challenge) {
      const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
      let challengeData = { ...randomType };

      // For specific lesson challenge, pick a random lesson ID (1-18)
      if (randomType.type === 'specific_lesson') {
        challengeData.lessonId = Math.floor(Math.random() * 18) + 1;
        challengeData.description = `Complete lesson #${challengeData.lessonId} today`;
      }

      await pool.query(`
        INSERT INTO daily_challenges (challenge_date, challenge_type, challenge_data, points_reward)
        VALUES ($1, $2, $3, $4)
      `, [today, randomType.type, JSON.stringify(challengeData), 50]);

      challengeResult = await pool.query('SELECT * FROM daily_challenges WHERE challenge_date = $1', [today]);
      challenge = challengeResult.rows[0];
    }

    // Check if user completed today's challenge
    const completionResult = await pool.query(`
      SELECT * FROM user_daily_completions
      WHERE user_id = $1 AND challenge_id = $2
    `, [req.user.id, challenge.id]);
    const completion = completionResult.rows[0];

    // For three_lessons challenge, count lessons completed today
    let lessonsCompletedToday = 0;
    if (challenge.challenge_type === 'three_lessons') {
      const lessonCountResult = await pool.query(`
        SELECT COUNT(DISTINCT lesson_id) as count
        FROM progress
        WHERE user_id = $1 AND DATE(completed_at) = $2 AND completed = true
      `, [req.user.id, today]);
      lessonsCompletedToday = parseInt(lessonCountResult.rows[0]?.count) || 0;
    }

    res.json({
      ...challenge,
      challenge_data: JSON.parse(challenge.challenge_data),
      completed: !!completion,
      completion: completion || null,
      lessonsCompletedToday
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete daily challenge
app.post('/api/daily-challenge/complete', authenticateToken, async (req, res) => {
  try {
    const { challengeId, timeTaken, score } = req.body;

    await pool.query(`
      INSERT INTO user_daily_completions (user_id, challenge_id, time_taken, score)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, challenge_id) DO NOTHING
    `, [req.user.id, challengeId, timeTaken, score]);

    // Update streak
    await updateUserStreak(req.user.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error completing daily challenge:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user streak
app.get('/api/streak', authenticateToken, async (req, res) => {
  try {
    let streakResult = await pool.query('SELECT * FROM user_streaks WHERE user_id = $1', [req.user.id]);
    let streak = streakResult.rows[0];

    // Initialize streak if doesn't exist
    if (!streak) {
      await pool.query(`
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, streak_freeze_count)
        VALUES ($1, 0, 0, 0)
      `, [req.user.id]);
      streakResult = await pool.query('SELECT * FROM user_streaks WHERE user_id = $1', [req.user.id]);
      streak = streakResult.rows[0];
    }

    // Check if streak should be broken (more than 1 day gap)
    if (streak.last_activity_date) {
      const lastActivity = new Date(streak.last_activity_date);
      const today = new Date();
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

      if (daysDiff > 1 && streak.streak_freeze_count > 0) {
        // Use streak freeze
        await pool.query(`
          UPDATE user_streaks
          SET streak_freeze_count = streak_freeze_count - 1,
              last_activity_date = CURRENT_DATE
          WHERE user_id = $1
        `, [req.user.id]);
        streak.streak_freeze_count -= 1;
      } else if (daysDiff > 1) {
        // Break streak
        await pool.query(`
          UPDATE user_streaks
          SET current_streak = 0
          WHERE user_id = $1
        `, [req.user.id]);
        streak.current_streak = 0;
      }
    }

    res.json(streak);
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update streak (helper function)
async function updateUserStreak(userId) {
  const streakResult = await pool.query('SELECT * FROM user_streaks WHERE user_id = $1', [userId]);
  let streak = streakResult.rows[0];

  const today = new Date().toISOString().split('T')[0];

  if (!streak) {
    // Initialize streak
    await pool.query(`
      INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
      VALUES ($1, 1, 1, $2)
    `, [userId, today]);
  } else {
    const lastActivity = streak.last_activity_date;

    // Only update if this is a new day
    if (lastActivity !== today) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      let newStreak = streak.current_streak;

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak = streak.current_streak + 1;
      } else if (daysDiff > 1) {
        // Gap - reset to 1
        newStreak = 1;
      }

      const longestStreak = Math.max(streak.longest_streak, newStreak);

      await pool.query(`
        UPDATE user_streaks
        SET current_streak = $1,
            longest_streak = $2,
            last_activity_date = $3
        WHERE user_id = $4
      `, [newStreak, longestStreak, today, userId]);
    }
  }
}

// Add streak freeze
app.post('/api/streak/freeze', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    await pool.query(`
      UPDATE user_streaks
      SET streak_freeze_count = streak_freeze_count + $1
      WHERE user_id = $2
    `, [amount, req.user.id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding streak freeze:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update leaderboard (called after lesson completion)
async function updateLeaderboard(userId, username, lessonData) {
  try {
    // Get user's current progress
    const progressResult = await pool.query('SELECT * FROM progress WHERE user_id = $1 AND completed = true', [userId]);
    const userProgress = progressResult.rows;

    const totalLessonsCompleted = userProgress.length;
    const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
    const averageScore = totalLessonsCompleted > 0 ? totalScore / totalLessonsCompleted : 0;
    const perfectLessons = userProgress.filter(p => p.mistakes === 0).length;
    const fastestTime = Math.min(...userProgress.map(p => p.time_taken || Infinity).filter(t => t !== Infinity), Infinity);

    // Get achievements count
    const achievementResult = await pool.query('SELECT COUNT(*) as count FROM achievements WHERE user_id = $1', [userId]);
    const achievementCount = parseInt(achievementResult.rows[0].count);

    // Get current streak
    const streakResult = await pool.query('SELECT current_streak FROM user_streaks WHERE user_id = $1', [userId]);
    const streak = streakResult.rows[0];
    const currentStreak = streak?.current_streak || 0;

    // Update main leaderboard
    await pool.query(`
      INSERT INTO leaderboard_entries (
        user_id, username, total_score, total_lessons_completed,
        average_score, total_achievements, fastest_lesson_time,
        perfect_lessons, current_streak, last_updated
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        username = $2,
        total_score = $3,
        total_lessons_completed = $4,
        average_score = $5,
        total_achievements = $6,
        fastest_lesson_time = $7,
        perfect_lessons = $8,
        current_streak = $9,
        last_updated = CURRENT_TIMESTAMP
    `, [
      userId, username, totalScore, totalLessonsCompleted,
      averageScore, achievementCount, fastestTime === Infinity ? null : fastestTime,
      perfectLessons, currentStreak
    ]);

    // Update weekly leaderboard
    const weekStart = getWeekStart();
    await pool.query(`
      INSERT INTO weekly_leaderboard (user_id, username, week_start, weekly_score, weekly_lessons, weekly_achievements)
      VALUES ($1, $2, $3, $4, 1, 0)
      ON CONFLICT(user_id, week_start) DO UPDATE SET
        weekly_score = weekly_leaderboard.weekly_score + $4,
        weekly_lessons = weekly_leaderboard.weekly_lessons + 1
    `, [userId, username, weekStart, lessonData.score || 0]);

    // Update lesson-specific leaderboard
    if (lessonData.lessonId) {
      await pool.query(`
        INSERT INTO lesson_leaderboard (user_id, username, lesson_id, best_time, best_score, attempts, last_updated)
        VALUES ($1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, lesson_id) DO UPDATE SET
          best_time = CASE WHEN $4 < lesson_leaderboard.best_time THEN $4 ELSE lesson_leaderboard.best_time END,
          best_score = CASE WHEN $5 > lesson_leaderboard.best_score THEN $5 ELSE lesson_leaderboard.best_score END,
          attempts = lesson_leaderboard.attempts + 1,
          last_updated = CURRENT_TIMESTAMP
      `, [userId, username, lessonData.lessonId, lessonData.timeTaken || 0, lessonData.score || 0]);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

// Helper function to get week start date (Monday)
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Get global leaderboard
app.get('/api/leaderboard/global', async (req, res) => {
  try {
    const { sortBy = 'total_score', limit = 100 } = req.query;

    const validSortFields = ['total_score', 'average_score', 'total_achievements', 'fastest_lesson_time', 'perfect_lessons', 'current_streak'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'total_score';

    const result = await pool.query(`
      SELECT
        user_id, username, total_score, total_lessons_completed,
        average_score, total_achievements, fastest_lesson_time,
        perfect_lessons, current_streak, last_updated
      FROM leaderboard_entries
      ORDER BY ${sortField} DESC, total_score DESC
      LIMIT $1
    `, [limit]);

    // Add rank
    const rankedLeaderboard = result.rows.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get weekly leaderboard
app.get('/api/leaderboard/weekly', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const weekStart = getWeekStart();

    const result = await pool.query(`
      SELECT
        user_id, username, weekly_score, weekly_lessons, weekly_achievements
      FROM weekly_leaderboard
      WHERE week_start = $1
      ORDER BY weekly_score DESC, weekly_lessons DESC
      LIMIT $2
    `, [weekStart, limit]);

    // Add rank
    const rankedLeaderboard = result.rows.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      week_start: weekStart
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get lesson-specific leaderboard
app.get('/api/leaderboard/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { sortBy = 'best_time', limit = 100 } = req.query;

    const sortField = sortBy === 'best_score' ? 'best_score DESC' : 'best_time ASC';

    const result = await pool.query(`
      SELECT
        user_id, username, lesson_id, best_time, best_score, attempts, last_updated
      FROM lesson_leaderboard
      WHERE lesson_id = $1
      ORDER BY ${sortField}
      LIMIT $2
    `, [lessonId, limit]);

    // Add rank
    const rankedLeaderboard = result.rows.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching lesson leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's rank and position
app.get('/api/leaderboard/rank', authenticateToken, async (req, res) => {
  try {
    const { type = 'global' } = req.query;

    if (type === 'weekly') {
      const weekStart = getWeekStart();
      const rankResult = await pool.query(`
        SELECT COUNT(*) + 1 as rank
        FROM weekly_leaderboard
        WHERE week_start = $1 AND weekly_score > (
          SELECT weekly_score FROM weekly_leaderboard
          WHERE user_id = $2 AND week_start = $1
        )
      `, [weekStart, req.user.id]);

      const userResult = await pool.query(`
        SELECT * FROM weekly_leaderboard
        WHERE user_id = $1 AND week_start = $2
      `, [req.user.id, weekStart]);

      const userData = userResult.rows[0];

      res.json({ rank: parseInt(rankResult.rows[0]?.rank) || null, ...userData });
    } else {
      const rankResult = await pool.query(`
        SELECT COUNT(*) + 1 as rank
        FROM leaderboard_entries
        WHERE total_score > (
          SELECT total_score FROM leaderboard_entries WHERE user_id = $1
        )
      `, [req.user.id]);

      const userResult = await pool.query(`
        SELECT * FROM leaderboard_entries WHERE user_id = $1
      `, [req.user.id]);

      const userData = userResult.rows[0];

      res.json({ rank: parseInt(rankResult.rows[0]?.rank) || null, ...userData });
    }
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
