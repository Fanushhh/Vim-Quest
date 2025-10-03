export const lessons = [
  {
    id: 1,
    title: "Basic Movement - hjkl",
    description: "Learn the fundamental Vim movement keys",
    difficulty: "beginner",
    instructions: "Use h, j, k, l to move the cursor through all three targets marked with 'X'",
    initialText: [
      "Welcome to Vim!",
      "Move around using:",
      "h - left",
      "j - down",
      "k - up",
      "l - right",
      "",
      "First target:  X........",
      "Second target: .......X.",
      "Third target:  ...X.....",
      "Fourth target: ........X"
    ],
    targetPosition: { row: 10, col: 8 },
    allowedCommands: ['h', 'j', 'k', 'l'],
    hints: [
      "Navigate to each X in order from top to bottom",
      "Use j to move down, l/h to move horizontally",
      "Final target is at row 10, column 8"
    ]
  },
  {
    id: 2,
    title: "Word Movement - w, b, e",
    description: "Navigate by words efficiently",
    difficulty: "beginner",
    instructions: "Use w (word forward), b (word back), e (end of word) to reach the target",
    initialText: [
      "The quick brown fox jumps over the lazy dog",
      "Navigate between words efficiently using w and b",
      "Practice moving: forward backward forward backward again",
      "Use e to reach end of words like example here",
      "The X marks your final target: here X is your goal"
    ],
    targetPosition: { row: 4, col: 37 },
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e'],
    hints: [
      "Use 'w' to jump forward by words",
      "Use 'b' to jump backward if you overshoot",
      "Use 'e' to reach the end of a word",
      "Final target is on the last line"
    ]
  },
  {
    id: 3,
    title: "Line Navigation - 0, $, ^",
    description: "Jump to the beginning and end of lines",
    difficulty: "beginner",
    instructions: "Use 0 (start of line), $ (end of line), ^ (first non-blank) to navigate",
    initialText: [
      "X.......jump to the end of this line........X",
      "    Practice with indented lines too........X",
      "X...use 0 to jump to the very beginning",
      "       Use ^ for first non-blank char.....X",
      "Navigate efficiently from start to end....X"
    ],
    targetPosition: { row: 4, col: 42 },
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', '0', '$', '^'],
    hints: [
      "Use '$' to jump to end of line, '0' to jump to start",
      "Use '^' to jump to first non-blank character on indented lines",
      "Practice navigating to different positions on each line",
      "Final target is at the end of the last line"
    ]
  },
  {
    id: 4,
    title: "Insert Mode - i, a, o",
    description: "Learn to enter insert mode",
    difficulty: "beginner",
    instructions: "Add the word 'vim' in three different places using i, a, and o",
    initialText: [
      "Insert the magic word before this word: editor",
      "Append the magic word after this:",
      "Open a new line and type the magic word below this line"
    ],
    task: "insert",
    targetText: "vim",
    targetCount: 3,
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC'],
    hints: [
      "The magic word is 'vim'",
      "First: Use 'i' to insert 'vim' before 'editor' on line 1",
      "Second: Use 'A' to append 'vim' at end of line 2",
      "Third: Use 'o' to open new line and type 'vim'",
      "Remember to press ESC after each insertion"
    ]
  },
  {
    id: 5,
    title: "Delete Commands - x, dd, dw",
    description: "Remove text efficiently",
    difficulty: "intermediate",
    instructions: "Use x (delete char), dd (delete line), dw (delete word) to clean up the text",
    initialText: [
      "Delete this entire line using dd",
      "Remove EXTRA WORDS from this sentence carefully",
      "Keep this line intact",
      "Delete UNNECESSARY words from here also",
      "This line should be deleted too",
      "Keep this line as well",
      "Remove single char: Xx here and here: yX"
    ],
    task: "delete",
    targetState: [
      "Remove from this sentence carefully",
      "Keep this line intact",
      "Delete words from here also",
      "Keep this line as well",
      "Remove single char: x here and here: y"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'x', 'dd', 'dw', 'd$'],
    hints: [
      "Use 'dd' to delete entire lines",
      "Use 'dw' to delete words",
      "Use 'x' to delete single characters",
      "Navigate carefully before deleting"
    ]
  },
  {
    id: 6,
    title: "Visual Mode - v, V",
    description: "Select and delete text visually",
    difficulty: "intermediate",
    instructions: "Use visual mode to select and delete multiple words and selections",
    initialText: [
      "Remove the word DELETE from this line ",
      "Select and delete THESE WORDS carefully here ",
      "Keep this line intact",
      "Remove MULTIPLE WORDS HERE from this sentence ",
      "Practice visual selection DELETE THIS TOO "
    ],
    task: "delete",
    targetState: [
      "Remove the word from this line",
      "Select and delete carefully here",
      "Keep this line intact",
      "Remove from this sentence",
      "Practice visual selection"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'v', 'V', 'd', 'x', 'ESC'],
    hints: [
      "Use 'v' to enter character-wise visual mode",
      "Use 'V' to enter line-wise visual mode",
      "Use 'w', 'b', 'h', 'l' to extend selection",
      "Press 'd' to delete the selection",
      "Remember to press ESC after deleting"
    ]
  },
  {
    id: 7,
    title: "Search - /, ?, n, N",
    description: "Find text quickly",
    difficulty: "intermediate",
    instructions: "Use / to search forward, ? backward, n for next, N for previous to find all targets",
    initialText: [
      "Find the word 'target' in this text",
      "The first target is here on line 1",
      "There is another target hiding on this line",
      "Keep searching: target appears multiple times",
      "You must find target everywhere in the document",
      "Navigate through each target using n and N",
      "The final target X is right here on this line",
      "Practice makes perfect with target searching"
    ],
    targetPosition: { row: 6, col: 11 },
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', '/', '?', 'n', 'N'],
    hints: [
      "Type '/target' and press Enter to start searching",
      "Press 'n' to jump to next match",
      "Press 'N' to go to previous match",
      "Navigate to the X on line 6",
      "You need to cycle through multiple matches"
    ]
  },
  {
    id: 8,
    title: "Undo and Redo - u, Ctrl+r",
    description: "Reverse and restore changes",
    difficulty: "intermediate",
    instructions: "Delete multiple lines, practice undo and redo to master time travel",
    initialText: [
      "Make changes and undo them",
      "Delete this line first",
      "Delete this line second",
      "Delete this line third",
      "Now undo all deletions",
      "Master time travel in Vim"
    ],
    task: "undo",
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'u', 'ctrl+r', 'dd', 'x', 'dw', 'd$'],
    hints: [
      "Step 1: Delete lines 2, 3, and 4 one by one using 'dd'",
      "Step 2: Press 'u' three times to undo all deletions",
      "Step 3: You can use Ctrl+r to redo if needed",
      "Practice undo/redo multiple times to get comfortable"
    ]
  },
  {
    id: 9,
    title: "Copy and Paste - y, p, P",
    description: "Duplicate text efficiently",
    difficulty: "intermediate",
    instructions: "Use y (yank), p (paste after), P (paste before) to duplicate lines and words",
    initialText: [
      "Copy this entire line with yy",
      "Paste it below here:",
      "",
      "Yank these words: important content here",
      "Paste words after this point:",
      "",
      "Practice copying: example text",
      "And paste before this line using P"
    ],
    task: "copy",
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'y', 'yy', 'p', 'P', 'yw', 'v', 'd', 'ESC'],
    hints: [
      "Use 'yy' to yank entire lines",
      "Use 'yw' to yank individual words",
      "Use 'p' to paste after cursor/line",
      "Use 'P' to paste before cursor/line",
      "Practice multiple yank and paste operations"
    ]
  },
  {
    id: 10,
    title: "Advanced Movement - gg, G, {, }",
    description: "Jump to specific locations",
    difficulty: "advanced",
    instructions: "Use gg (top), G (bottom), { (paragraph up), } (paragraph down) to navigate efficiently",
    initialText: [
      "First line of the document - start here",
      "",
      "Second paragraph here",
      "More text in this section",
      "Continue reading this part",
      "",
      "Third paragraph begins",
      "Middle section content",
      "",
      "Fourth paragraph section",
      "More information here",
      "",
      "Fifth paragraph area",
      "",
      "Almost at the end now",
      "Find the X at the bottom X"
    ],
    targetPosition: { row: 15, col: 25 },
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}'],
    hints: [
      "Use 'gg' to jump to the top of the document",
      "Use 'G' to jump to the bottom",
      "Use '}' to jump forward by paragraphs",
      "Use '{' to jump backward by paragraphs",
      "Practice navigating between paragraphs multiple times",
      "Final target is at the end of the last line"
    ]
  },
  {
    id: 11,
    title: "Replace - r, R, c",
    description: "Change text in place",
    difficulty: "advanced",
    instructions: "Use r (replace char), R (replace mode), cw (change word) to fix all errors",
    initialText: [
      "Replace X with O here",
      "Change bad to good: this is bad",
      "Fix these errors: X should be Y",
      "Change wrong to right in this sentence: wrong answer",
      "Replace A with B: testing A here",
      "Use Replace mode to change: WRONGWORDHERE to correct_word_here"
    ],
    task: "replace",
    targetState: [
      "Replace O with O here",
      "Change bad to good: this is good",
      "Fix these errors: Y should be Y",
      "Change wrong to right in this sentence: right answer",
      "Replace A with B: testing B here",
      "Use Replace mode to change: correct_word_here to correct_word_here"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', 'r', 'R', 'c', 'cw', 'ESC', 'i', 'a'],
    hints: [
      "Line 1: Use 'r' to replace X with O",
      "Line 2: Use 'cw' on 'bad' and type 'good'",
      "Line 3: Use 'r' to replace X with Y",
      "Line 4: Use 'cw' on 'wrong' and type 'right'",
      "Line 5: Use 'r' to replace A with B",
      "Line 6: Use 'R' on WRONGWORDHERE and type 'correct_word_here' (press ESC when done)"
    ]
  },
  {
    id: 12,
    title: "Marks and Jumps - m, '",
    description: "Bookmark positions",
    difficulty: "advanced",
    instructions: "Set 3 marks (a, b, c) and practice jumping between them",
    initialText: [
      "Set mark 'a' here with ma - this is position A",
      "Navigate down to the next section",
      "Set mark 'b' here with mb - this is position B",
      "Keep moving through the document",
      "Set mark 'c' here with mc - this is position C",
      "Now practice jumping between marks",
      "Jump to 'a then to 'b then to 'c",
      "Practice multiple jumps: 'a 'b 'c 'a 'c 'b",
      "Marks make navigation powerful and efficient!"
    ],
    task: "marks",
    requiredMarks: ['a', 'b', 'c'],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', 'm', "'", 'a', 'b', 'c'],
    hints: [
      "Navigate to line 1 and press 'ma' to set mark a",
      "Navigate to line 3 and press 'mb' to set mark b",
      "Navigate to line 5 and press 'mc' to set mark c",
      "Test your marks: type 'a to jump to mark a",
      "Practice jumping between marks with 'a, 'b, 'c",
      "Lesson completes when all 3 marks are set"
    ]
  },
  {
    id: 13,
    title: "Function Navigation",
    description: "Navigate through code like a pro",
    difficulty: "developer",
    instructions: "Jump to function definitions and navigate code blocks efficiently",
    initialText: [
      "function calculateTotal(items) {",
      "  let sum = 0;",
      "  for (let item of items) {",
      "    sum += item.price;",
      "  }",
      "  return sum;",
      "}",
      "",
      "function processOrder(order) {",
      "  const total = calculateTotal(order.items);",
      "  return { ...order, total };",
      "}",
      "",
      "// Navigate to the X inside processOrder",
      "// X is at the return statement"
    ],
    targetPosition: { row: 10, col: 9 },
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', '/', '?', 'n', 'N', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC', 'x', 'dd', 'dw', 'd$', 'v', 'V', 'd', 'u', 'ctrl+r', 'y', 'yy', 'p', 'P', 'yw', 'r', 'R', 'c', 'cw', 'm', "'"],
    hints: [
      "Use '}' to jump to next code block",
      "Use '{' to jump back",
      "Search for 'return' to find target quickly",
      "Practice navigating between functions"
    ]
  },
  {
    id: 14,
    title: "Refactoring Variables",
    description: "Rename variables across code",
    difficulty: "developer",
    instructions: "Change all instances of 'oldName' to 'newName' using search and replace techniques",
    initialText: [
      "const oldName = 'value';",
      "console.log(oldName);",
      "function test(oldName) {",
      "  return oldName.toUpperCase();",
      "}",
      "const result = test(oldName);"
    ],
    task: "replace",
    targetState: [
      "const newName = 'value';",
      "console.log(newName);",
      "function test(newName) {",
      "  return newName.toUpperCase();",
      "}",
      "const result = test(newName);"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', '/', '?', 'n', 'N', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC', 'x', 'dd', 'dw', 'd$', 'v', 'V', 'd', 'u', 'ctrl+r', 'y', 'yy', 'p', 'P', 'yw', 'r', 'R', 'c', 'cw', 'm', "'"],
    hints: [
      "Search for 'oldName' using /oldName",
      "Use 'cw' to change each word to 'newName'",
      "Press 'n' to jump to next occurrence",
      "Remember to press ESC after each change"
    ]
  },
  {
    id: 15,
    title: "Comment Block Editing",
    description: "Manage code comments efficiently",
    difficulty: "developer",
    instructions: "Add '//' at the start of each code line to comment them out",
    initialText: [
      "function debugFunction() {",
      "  console.log('debug 1');",
      "  console.log('debug 2');",
      "  console.log('debug 3');",
      "  return true;",
      "}"
    ],
    task: "replace",
    targetState: [
      "function debugFunction() {",
      "//  console.log('debug 1');",
      "//  console.log('debug 2');",
      "//  console.log('debug 3');",
      "//  return true;",
      "}"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', '/', '?', 'n', 'N', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC', 'x', 'dd', 'dw', 'd$', 'v', 'V', 'd', 'u', 'ctrl+r', 'y', 'yy', 'p', 'P', 'yw', 'r', 'R', 'c', 'cw', 'm', "'"],
    hints: [
      "Navigate to line 2, use 'I' to insert at beginning",
      "Type '//' then press ESC",
      "Repeat for each line that needs commenting",
      "Use 'j' and 'I' to move efficiently between lines"
    ]
  },
  {
    id: 16,
    title: "Code Block Deletion",
    description: "Remove entire code sections",
    difficulty: "developer",
    instructions: "Delete the entire debug section while keeping the rest of the code intact",
    initialText: [
      "function main() {",
      "  const data = fetchData();",
      "  ",
      "  // DEBUG START",
      "  console.log('debug info');",
      "  console.log('more debug');",
      "  // DEBUG END",
      "  ",
      "  return processData(data);",
      "}"
    ],
    task: "delete",
    targetState: [
      "function main() {",
      "  const data = fetchData();",
      "  ",
      "  ",
      "  return processData(data);",
      "}"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', '/', '?', 'n', 'N', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC', 'x', 'dd', 'dw', 'd$', 'v', 'V', 'd', 'u', 'ctrl+r', 'y', 'yy', 'p', 'P', 'yw', 'r', 'R', 'c', 'cw', 'm', "'"],
    hints: [
      "Search for 'DEBUG START' to locate the section",
      "Use 'dd' to delete lines one by one",
      "Or use 'V' to select multiple lines and 'd' to delete",
      "Keep the empty lines and function structure"
    ]
  },
  {
    id: 17,
    title: "Import Statement Organization",
    description: "Reorder and manage imports",
    difficulty: "developer",
    instructions: "Move the React import to the top and add a missing import",
    initialText: [
      "import { useState } from 'react';",
      "import axios from 'axios';",
      "import React from 'react';",
      "import './styles.css';",
      "",
      "// React import should be first"
    ],
    task: "replace",
    targetState: [
      "import React from 'react';",
      "import { useState } from 'react';",
      "import axios from 'axios';",
      "import './styles.css';",
      "",
      "// React import should be first"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', '/', '?', 'n', 'N', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC', 'x', 'dd', 'dw', 'd$', 'v', 'V', 'd', 'u', 'ctrl+r', 'y', 'yy', 'p', 'P', 'yw', 'r', 'R', 'c', 'cw', 'm', "'"],
    hints: [
      "Navigate to line 3 (React import)",
      "Use 'dd' to cut the line",
      "Use 'gg' to go to top",
      "Use 'P' to paste before first line"
    ]
  },
  {
    id: 18,
    title: "API Endpoint Correction",
    description: "Fix API endpoint strings",
    difficulty: "developer",
    instructions: "Change all '/api/v1/' to '/api/v2/' in the endpoint URLs",
    initialText: [
      "const USERS_API = '/api/v1/users';",
      "const POSTS_API = '/api/v1/posts';",
      "const AUTH_API = '/api/v1/auth';",
      "const DATA_API = '/api/v1/data';"
    ],
    task: "replace",
    targetState: [
      "const USERS_API = '/api/v2/users';",
      "const POSTS_API = '/api/v2/posts';",
      "const AUTH_API = '/api/v2/auth';",
      "const DATA_API = '/api/v2/data';"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', '/', '?', 'n', 'N', 'i', 'a', 'o', 'O', 'A', 'I', 'ESC', 'x', 'dd', 'dw', 'd$', 'v', 'V', 'd', 'u', 'ctrl+r', 'y', 'yy', 'p', 'P', 'yw', 'r', 'R', 'c', 'cw', 'm', "'"],
    hints: [
      "Search for 'v1' using /v1",
      "Use 'r' twice to replace 'v1' with 'v2'",
      "Or use 'cw' to change the word",
      "Use 'n' to jump to next occurrence"
    ]
  }
];

export const achievements = [
  // Progression achievements (Easy - Medium)
  { type: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', points: 10 },
  { type: 'beginner_complete', title: 'Vim Novice', description: 'Complete all beginner lessons', icon: '🌱', points: 50 },
  { type: 'intermediate_complete', title: 'Vim Apprentice', description: 'Complete all intermediate lessons', icon: '⚡', points: 100 },
  { type: 'advanced_complete', title: 'Vim Master', description: 'Complete all advanced lessons', icon: '🏆', points: 150 },
  { type: 'developer_complete', title: 'Code Ninja', description: 'Complete all developer lessons', icon: '💻', points: 200 },
  { type: 'all_complete', title: 'Vim Legend', description: 'Complete all lessons', icon: '👑', points: 500 },

  // Performance achievements (Medium)
  { type: 'speed_demon', title: 'Speed Demon', description: 'Complete a lesson in under 30 seconds', icon: '🚀', points: 75 },
  { type: 'lightning_fast', title: 'Lightning Fast', description: 'Complete 3 lessons under 30 seconds each', icon: '⚡', points: 200 },
  { type: 'perfect_score', title: 'Perfectionist', description: 'Complete a lesson without mistakes', icon: '💎', points: 50 },
  { type: 'flawless_five', title: 'Flawless Five', description: 'Complete 5 lessons without any mistakes', icon: '✨', points: 150 },
  { type: 'efficient_editor', title: 'Efficient Editor', description: 'Complete a lesson with 90+ score', icon: '📈', points: 40 },

  // Skill-based achievements (Medium - Hard)
  { type: 'movement_master', title: 'Movement Master', description: 'Complete lessons 1-3 with perfect scores', icon: '🎮', points: 120 },
  { type: 'deletion_expert', title: 'Deletion Expert', description: 'Complete lessons 5, 6, 8 with perfect scores', icon: '🗑️', points: 130 },
  { type: 'search_specialist', title: 'Search Specialist', description: 'Complete lessons 7, 12 with perfect scores', icon: '🔍', points: 110 },
  { type: 'copy_paste_pro', title: 'Copy-Paste Pro', description: 'Complete lesson 9 with perfect score', icon: '📋', points: 80 },
  { type: 'refactor_guru', title: 'Refactoring Guru', description: 'Complete lessons 14, 15, 18 with perfect scores', icon: '🔧', points: 140 },

  // Practice achievements (Medium - Very Hard)
  { type: 'week_streak', title: 'Dedicated Learner', description: 'Practice for 7 days in a row', icon: '🔥', points: 100 },
  { type: 'month_warrior', title: 'Month Warrior', description: 'Practice for 30 days in a row', icon: '💪', points: 500 },
  { type: 'early_bird', title: 'Early Bird', description: 'Complete a lesson before 8 AM', icon: '🌅', points: 30 },
  { type: 'night_owl', title: 'Night Owl', description: 'Complete a lesson after 10 PM', icon: '🦉', points: 30 },

  // Challenge achievements (Medium - Hard)
  { type: 'comeback_kid', title: 'Comeback Kid', description: 'Retry and improve your score by 20+ points', icon: '🔄', points: 60 },
  { type: 'persistent', title: 'Persistent', description: 'Retry the same lesson 3 times', icon: '🎯', points: 50 },
  { type: 'quick_learner', title: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: '📚', points: 120 },
  { type: 'marathon_runner', title: 'Marathon Runner', description: 'Complete 10 lessons in one session', icon: '🏃', points: 250 },

  // Mastery achievements (Hard - Ultimate)
  { type: 'triple_perfect', title: 'Triple Perfect', description: 'Get perfect score on 3 consecutive lessons', icon: '🌟', points: 180 },
  { type: 'speed_and_accuracy', title: 'Speed & Accuracy', description: 'Complete lesson under 30s with no mistakes', icon: '💫', points: 150 },
  { type: 'vim_sensei', title: 'Vim Sensei', description: 'Complete all lessons with 90+ average score', icon: '🥋', points: 300 },
  { type: 'ultimate_champion', title: 'Ultimate Champion', description: 'Achieve all other achievements', icon: '🏅', points: 1000 }
];
