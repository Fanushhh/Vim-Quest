import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'vim-quest-secret-key-change-in-production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
app.use(cors({
  origin: CLIENT_URL,
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

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(username, hashedPassword);

    const token = jwt.sign({ id: result.lastInsertRowid, username }, JWT_SECRET);
    res.json({ token, username });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
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

    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);

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
app.get('/api/progress', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM progress WHERE user_id = ?');
    const progress = stmt.all(req.user.id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save lesson progress
app.post('/api/progress', authenticateToken, (req, res) => {
  try {
    const { lessonId, completed, score } = req.body;

    const stmt = db.prepare(`
      INSERT INTO progress (user_id, lesson_id, completed, score, completed_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, lesson_id)
      DO UPDATE SET completed = ?, score = ?, completed_at = CURRENT_TIMESTAMP
    `);

    stmt.run(req.user.id, lessonId, completed ? 1 : 0, score, completed ? 1 : 0, score);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get achievements
app.get('/api/achievements', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM achievements WHERE user_id = ?');
    const achievements = stmt.all(req.user.id);
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlock achievement
app.post('/api/achievements', authenticateToken, (req, res) => {
  try {
    const { achievementType } = req.body;

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO achievements (user_id, achievement_type)
      VALUES (?, ?)
    `);

    stmt.run(req.user.id, achievementType);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
