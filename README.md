# ⌨️ VIM QUEST

**Master Vim, One Command at a Time**

An interactive, gamified web application to learn Vim commands through hands-on lessons, daily challenges, and achievements. Build muscle memory with real-time practice and track your progress with streaks and points.

---

## 🎮 Features

### Core Learning
- **18 Progressive Lessons**: From basic movement to advanced developer commands
- **Interactive Vim Simulator**: Practice in a real-time editor environment
- **4 Difficulty Levels**: Beginner, Intermediate, Advanced, and Developer

### Gamification
- **Daily Challenges**: New challenge every day to keep you engaged
- **Streak Tracking**: Build and maintain daily learning streaks
- **30+ Achievements**: Unlock badges based on performance and dedication
- **Points System**: Earn points for completing lessons and challenges
- **Shop**: Customize your experience with themes, titles, and boosters

### Progression & Customization
- **User Accounts**: Secure authentication with JWT
- **Progress Tracking**: Track completion, scores, and performance across devices
- **Profile Customization**: Unlock and equip custom themes, badges, and titles
- **Boosters**: Use streak freezes, double XP, and extra hints
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

---

## 📚 Lesson Categories

### Beginner (Lessons 1-4)
- Basic Movement (hjkl)
- Word Movement (w, b, e)
- Line Navigation (0, $, ^)
- Insert Mode (i, a, o)

### Intermediate (Lessons 5-9)
- Delete Commands (x, dd, dw)
- Visual Mode (v, V)
- Search (/, ?, n, N)
- Undo/Redo (u, Ctrl+r)
- Copy/Paste (y, p, P)

### Advanced (Lessons 10-12)
- Advanced Movement (gg, G, {, })
- Replace (r, R, c, cw)
- Marks and Jumps (m, ')

### Developer (Lessons 13-18)
- Code Navigation & Refactoring
- Multi-line Operations
- Advanced Text Manipulation
- Real-world Coding Scenarios

---

## 🎯 Achievement System

### Progression Achievements
- 🎯 **First Steps** - Complete your first lesson (10 pts)
- 🌱 **Vim Novice** - Complete all beginner lessons (50 pts)
- ⚡ **Vim Apprentice** - Complete all intermediate lessons (100 pts)
- 🏆 **Vim Master** - Complete all advanced lessons (150 pts)
- 💻 **Code Ninja** - Complete all developer lessons (200 pts)
- 👑 **Vim Legend** - Complete all 18 lessons (500 pts)

### Performance Achievements
- 🚀 **Speed Demon** - Complete a lesson in under 30 seconds (75 pts)
- 💎 **Perfectionist** - Complete a lesson without mistakes (50 pts)
- 📈 **Efficient Editor** - Complete a lesson with 90+ score (40 pts)
- ✨ **Flawless Five** - Complete 5 lessons without any mistakes (150 pts)

### Skill-Based Achievements
- 🎮 **Movement Master** - Perfect scores on lessons 1-3 (120 pts)
- 🗑️ **Deletion Expert** - Perfect scores on lessons 5, 6, 8 (130 pts)
- 🔍 **Search Specialist** - Perfect scores on lessons 7, 12 (110 pts)
- 🔧 **Refactoring Guru** - Perfect scores on lessons 14, 15, 18 (140 pts)

### Mastery Achievements
- 🌟 **Triple Perfect** - Get perfect score on 3 consecutive lessons (180 pts)
- 💫 **Speed & Accuracy** - Complete lesson under 30s with no mistakes (150 pts)
- 🥋 **Vim Sensei** - Complete all lessons with 90+ average score (300 pts)
- 🏅 **Ultimate Champion** - Achieve all other achievements (1000 pts)

*And many more challenges to discover!*

---

## 🎨 Customization Shop

Spend your hard-earned points on:

### Themes
- Ocean, Forest, Sunset, Cyberpunk, and more
- Custom color schemes for the entire app

### Titles
- Display special titles like "Vim Wizard" or "Speed Typing Legend"

### Badge Effects
- Animated effects for your achievement badges
- Glow, pulse, and sparkle animations

### Boosters
- **Double XP** - Earn 2x points for a limited time
- **Streak Freeze** - Protect your streak when you miss a day
- **Extra Hints** - Get additional help on difficult lessons

---

## 🔥 Daily Challenges & Streaks

### Daily Challenges
Every day, receive a new challenge from 5 types:
- **Speed Run** - Complete any lesson in under 45 seconds
- **Perfect Performance** - Complete any lesson with 0 mistakes
- **Master This Lesson** - Complete a specific lesson
- **Score Champion** - Achieve a score of 95+ on any lesson
- **Triple Play** - Complete 3 different lessons today

Complete daily challenges to earn bonus points and maintain your streak!

### Streak System
- Track consecutive days of practice
- View your current and longest streaks
- Use streak freezes to protect your progress
- Earn special achievements for long streaks

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vim-quest.git
cd vim-quest

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1: Start the backend
cd server
node server.js

# Terminal 2: Start the frontend
cd client
npm run dev
```

Visit `http://localhost:5173` to start your Vim journey!

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render (free hosting).

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling with dark theme
- **Sound Manager** - Audio feedback system

### Backend
- **Express.js** - REST API server
- **SQLite** - Lightweight database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Features
- Real-time Vim command processing
- Progress synchronization across devices
- Achievement tracking system
- Daily challenge generator
- Streak calculation engine
- Shop and customization system

---

## 📊 Database Schema

The app uses SQLite with the following tables:
- `users` - User authentication and profiles
- `progress` - Lesson completion and scores
- `achievements` - Unlocked achievements
- `user_purchases` - Shop items owned
- `user_customizations` - Active customizations
- `user_boosters` - Active boosters and effects
- `daily_challenges` - Generated daily challenges
- `user_daily_completions` - Completed daily challenges
- `user_streaks` - Streak tracking data

---

## 🎓 Learning Philosophy

Vim Quest is designed to make learning Vim:
- **Interactive** - Practice in a real simulator, not just reading
- **Progressive** - Build from basics to advanced concepts
- **Engaging** - Gamification keeps you motivated
- **Measurable** - Track your improvement over time
- **Habit-forming** - Daily challenges and streaks build consistency

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new lessons
- Create new achievements
- Design new themes
- Improve the UI/UX
- Fix bugs
- Enhance documentation

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🎉 Start Your Vim Journey Today!

Whether you're a complete beginner or looking to master advanced commands, Vim Quest makes learning Vim fun, interactive, and rewarding.

**Happy Vimming! ⌨️🎮**
