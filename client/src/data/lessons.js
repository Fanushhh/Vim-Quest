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
      "Remove the word DELETE from this line",
      "Select and delete THESE WORDS carefully here",
      "Keep this line intact",
      "Remove MULTIPLE WORDS HERE from this sentence",
      "Practice visual selection DELETE THIS TOO"
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
      "Use Replace mode: fix_this_entire_word"
    ],
    task: "replace",
    targetState: [
      "Replace O with O here",
      "Change bad to good: this is good",
      "Fix these errors: Y should be Y",
      "Change wrong to right in this sentence: right answer",
      "Replace A with B: testing B here",
      "Use Replace mode: correct_word_here"
    ],
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', 'r', 'R', 'c', 'cw', 'ESC', 'i', 'a'],
    hints: [
      "Use 'r' to replace single characters",
      "Use 'cw' to change entire words",
      "Use 'R' to enter replace mode for multiple characters",
      "Remember to press ESC after using insert/replace modes",
      "Navigate carefully to each position before replacing"
    ]
  },
  {
    id: 12,
    title: "Marks and Jumps - m, '",
    description: "Bookmark positions",
    difficulty: "advanced",
    instructions: "Use m{a-z} to set multiple marks, '{a-z} to jump between marks efficiently",
    initialText: [
      "Set mark 'a' here with ma - this is position A",
      "Navigate down to the next section",
      "Set mark 'b' here with mb - this is position B",
      "Keep moving through the document",
      "Set mark 'c' here with mc - this is position C",
      "Now practice jumping between marks",
      "Jump to 'a then to 'b then to 'c",
      "Practice multiple jumps: 'a 'b 'c 'a 'c 'b",
      "Marks make navigation powerful",
      "Final target after jumping to all marks X"
    ],
    targetPosition: { row: 9, col: 42 },
    allowedCommands: ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}', 'm', "'", 'a', 'b', 'c'],
    hints: [
      "Set mark 'a' on line 1 with 'ma'",
      "Set mark 'b' on line 3 with 'mb'",
      "Set mark 'c' on line 5 with 'mc'",
      "Jump to marks using 'a, 'b, 'c",
      "Practice jumping between marks multiple times",
      "Final target is at the end of the last line"
    ]
  }
];

export const achievements = [
  { type: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { type: 'beginner_complete', title: 'Vim Novice', description: 'Complete all beginner lessons', icon: '🌱' },
  { type: 'intermediate_complete', title: 'Vim Apprentice', description: 'Complete all intermediate lessons', icon: '⚡' },
  { type: 'advanced_complete', title: 'Vim Master', description: 'Complete all advanced lessons', icon: '🏆' },
  { type: 'all_complete', title: 'Vim Legend', description: 'Complete all lessons', icon: '👑' },
  { type: 'speed_demon', title: 'Speed Demon', description: 'Complete a lesson in under 30 seconds', icon: '🚀' },
  { type: 'perfect_score', title: 'Perfectionist', description: 'Complete a lesson without mistakes', icon: '💎' },
  { type: 'week_streak', title: 'Dedicated Learner', description: 'Practice for 7 days in a row', icon: '🔥' }
];
