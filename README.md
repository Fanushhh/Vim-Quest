# ⌨️ VIM QUEST

**Master Vim, One Command at a Time**

An interactive, gamified web application to learn Vim commands through hands-on lessons and achievements.

---

## 🎮 Features

- **12 Progressive Lessons**: From basic movement to advanced commands
- **Interactive Vim Simulator**: Practice in a real-time editor
- **Achievement System**: Unlock badges as you progress
- **User Accounts**: Track your progress and scores
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with GitHub-inspired colors

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

Visit `http://localhost:5173` to play!

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render (free hosting).

---

## 🛠️ Tech Stack

### Frontend
- React 18, Vite, CSS3

### Backend
- Express.js, SQLite, JWT, bcrypt

---

## 🎯 Achievements

- 🎯 First Steps - Complete your first lesson
- 🌱 Vim Novice - Complete all beginner lessons
- ⚡ Vim Apprentice - Complete all intermediate lessons
- 🏆 Vim Master - Complete all advanced lessons
- 👑 Vim Legend - Complete all 12 lessons

---

**Happy Vimming! 🎉**
