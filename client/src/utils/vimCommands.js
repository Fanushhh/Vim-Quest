// Movement commands
export function moveCursor(cursorPos, textLines, command) {
  const newPos = { ...cursorPos };

  switch (command) {
    case 'h': // left
      newPos.col = Math.max(0, cursorPos.col - 1);
      break;

    case 'j': // down
      newPos.row = Math.min(textLines.length - 1, cursorPos.row + 1);
      break;

    case 'k': // up
      newPos.row = Math.max(0, cursorPos.row - 1);
      break;

    case 'l': // right
      newPos.col = Math.min(textLines[cursorPos.row]?.length - 1 || 0, cursorPos.col + 1);
      break;

    case 'w': // word forward
      const lineW = textLines[cursorPos.row] || '';
      let newColW = cursorPos.col;

      // If currently on whitespace, move to next word
      if (/\s/.test(lineW[newColW])) {
        while (newColW < lineW.length && /\s/.test(lineW[newColW])) {
          newColW++;
        }
      } else {
        // Currently on a non-whitespace character (in a word)
        // Move to end of current word
        while (newColW < lineW.length && /\S/.test(lineW[newColW])) {
          newColW++;
        }
        // Skip whitespace to reach beginning of next word
        while (newColW < lineW.length && /\s/.test(lineW[newColW])) {
          newColW++;
        }
      }

      // Ensure we don't go past end of line
      if (newColW >= lineW.length) {
        newColW = Math.max(0, lineW.length - 1);
      }

      newPos.col = newColW;
      break;

    case 'b': // word backward
      const lineB = textLines[cursorPos.row] || '';
      const beforeCursorB = lineB.slice(0, cursorPos.col);
      const matchB = beforeCursorB.match(/\S+\s*$/);
      if (matchB) {
        newPos.col = matchB.index;
      } else {
        newPos.col = 0;
      }
      break;

    case 'e': // end of word
      const lineE = textLines[cursorPos.row] || '';
      const afterCursorE = lineE.slice(cursorPos.col + 1);
      const matchE = afterCursorE.match(/\S+/);
      if (matchE) {
        newPos.col = cursorPos.col + 1 + matchE.index + matchE[0].length - 1;
      } else {
        newPos.col = Math.max(0, lineE.length - 1);
      }
      break;

    case '0': // start of line
      newPos.col = 0;
      break;

    case '$': // end of line
      newPos.col = (textLines[cursorPos.row]?.length - 1) || 0;
      break;

    case '^': // first non-blank character
      const currentLine = textLines[cursorPos.row] || '';
      const firstNonBlank = currentLine.search(/\S/);
      newPos.col = firstNonBlank === -1 ? 0 : firstNonBlank;
      break;

    case 'gg': // top of file
      newPos.row = 0;
      newPos.col = 0;
      break;

    case 'G': // bottom of file
      newPos.row = textLines.length - 1;
      break;

    case '{': // previous paragraph (backward to empty line)
      let prevRow = cursorPos.row - 1;
      // Skip current paragraph
      while (prevRow >= 0 && textLines[prevRow].trim() !== '') {
        prevRow--;
      }
      // Skip empty lines
      while (prevRow >= 0 && textLines[prevRow].trim() === '') {
        prevRow--;
      }
      newPos.row = Math.max(0, prevRow + 1);
      newPos.col = 0;
      break;

    case '}': // next paragraph (forward to empty line)
      let nextRow = cursorPos.row + 1;
      // Skip current paragraph
      while (nextRow < textLines.length && textLines[nextRow].trim() !== '') {
        nextRow++;
      }
      // Skip empty lines
      while (nextRow < textLines.length && textLines[nextRow].trim() === '') {
        nextRow++;
      }
      newPos.row = Math.min(textLines.length - 1, nextRow);
      newPos.col = 0;
      break;
  }

  return newPos;
}

// Delete commands
export function deleteText(textLines, cursorPos, command, visualStart = null, mode = 'normal') {
  const newLines = [...textLines];
  let newCursorPos = { ...cursorPos };
  let message = '';

  if (command === 'd' && mode === 'visual' && visualStart) {
    // Delete visual selection
    const start = Math.min(visualStart.col, cursorPos.col);
    const end = Math.max(visualStart.col, cursorPos.col);
    const line = newLines[cursorPos.row];

    if (line && visualStart.row === cursorPos.row) {
      // Visual mode delete: from start up to (but NOT including) cursor position
      // This matches Vim behavior where 'w' moves to next word but visual delete
      // doesn't include that first character of the next word
      const newLine = line.slice(0, start) + line.slice(end);
      newLines[cursorPos.row] = newLine;
      // Ensure cursor doesn't exceed new line length
      newCursorPos.col = Math.min(start, Math.max(0, newLine.length - 1));
      message = 'Deleted selection';
    }
  } else if (command === 'x') {
    // Delete character under cursor
    const line = newLines[cursorPos.row];
    if (line && cursorPos.col < line.length) {
      newLines[cursorPos.row] = line.slice(0, cursorPos.col) + line.slice(cursorPos.col + 1);
      message = 'Deleted character';
    }
  } else if (command === 'dd') {
    // Delete entire line
    newLines.splice(cursorPos.row, 1);
    if (newLines.length === 0) {
      newLines.push('');
    }
    newCursorPos.row = Math.min(cursorPos.row, newLines.length - 1);
    newCursorPos.col = 0;
    message = 'Deleted line';
  } else if (command === 'dw') {
    // Delete word
    const line = newLines[cursorPos.row];
    if (line) {
      const restOfLine = line.slice(cursorPos.col);
      const match = restOfLine.match(/^\S+\s*/);
      if (match) {
        newLines[cursorPos.row] =
          line.slice(0, cursorPos.col) +
          line.slice(cursorPos.col + match[0].length);
        message = 'Deleted word';
      }
    }
  } else if (command === 'd$') {
    // Delete to end of line
    const line = newLines[cursorPos.row];
    if (line) {
      newLines[cursorPos.row] = line.slice(0, cursorPos.col);
      message = 'Deleted to end of line';
    }
  }

  return { newLines, newCursorPos, message };
}

// Insert text
export function insertText(textLines, cursorPos, char) {
  const newLines = [...textLines];
  const line = newLines[cursorPos.row];
  newLines[cursorPos.row] =
    line.slice(0, cursorPos.col) + char + line.slice(cursorPos.col);
  return newLines;
}

// Yank (copy) commands
export function yankText(textLines, cursorPos, command, visualStart = null, mode = 'normal') {
  let yankedContent = '';
  let registerType = 'char';

  if (command === 'yy') {
    // Yank entire line
    yankedContent = textLines[cursorPos.row];
    registerType = 'line';
  } else if (command === 'yw') {
    // Yank word
    const line = textLines[cursorPos.row];
    const restOfLine = line.slice(cursorPos.col);
    const match = restOfLine.match(/^\S+\s*/);
    if (match) {
      yankedContent = match[0];
      registerType = 'char';
    }
  } else if (command === 'y' && mode === 'visual' && visualStart) {
    // Yank visual selection
    if (visualStart.row === cursorPos.row) {
      const line = textLines[cursorPos.row];
      const start = Math.min(visualStart.col, cursorPos.col);
      const end = Math.max(visualStart.col, cursorPos.col);
      yankedContent = line.slice(start, end + 1);
      registerType = 'char';
    }
  }

  return {
    content: yankedContent,
    type: registerType,
    message: yankedContent ? `Yanked: "${yankedContent}"` : 'Nothing to yank'
  };
}

// Replace commands
export function replaceText(textLines, cursorPos, command, newChar = '') {
  const newLines = [...textLines];
  let newCursorPos = { ...cursorPos };
  let message = '';
  let enterInsertMode = false;

  if (command === 'r' && newChar) {
    // Replace single character
    const line = newLines[cursorPos.row];
    if (cursorPos.col < line.length) {
      newLines[cursorPos.row] =
        line.slice(0, cursorPos.col) + newChar + line.slice(cursorPos.col + 1);
      message = `Replaced with '${newChar}'`;
    }
  } else if (command === 'cw') {
    // Change word (delete word and enter insert mode)
    const line = newLines[cursorPos.row];
    if (line) {
      const restOfLine = line.slice(cursorPos.col);
      const match = restOfLine.match(/^\S+\s*/);
      if (match) {
        newLines[cursorPos.row] =
          line.slice(0, cursorPos.col) +
          line.slice(cursorPos.col + match[0].length);
        message = 'Changed word';
        enterInsertMode = true;
      }
    }
  }

  return { newLines, newCursorPos, message, enterInsertMode };
}

// Paste commands
export function pasteText(textLines, cursorPos, register, registerType, command) {
  if (!register) {
    return { newLines: textLines, newCursorPos: cursorPos, message: 'Nothing in register' };
  }

  const newLines = [...textLines];
  let newCursorPos = { ...cursorPos };
  let message = '';

  if (registerType === 'line') {
    // Paste line
    if (command === 'p') {
      // Paste after current line
      newLines.splice(cursorPos.row + 1, 0, register);
      newCursorPos.row = cursorPos.row + 1;
      newCursorPos.col = 0;
      message = 'Pasted line below';
    } else if (command === 'P') {
      // Paste before current line
      newLines.splice(cursorPos.row, 0, register);
      newCursorPos.col = 0;
      message = 'Pasted line above';
    }
  } else {
    // Paste character/word
    const line = newLines[cursorPos.row];
    if (command === 'p') {
      // Paste after cursor
      const insertPos = Math.min(cursorPos.col + 1, line.length);
      newLines[cursorPos.row] = line.slice(0, insertPos) + register + line.slice(insertPos);
      newCursorPos.col = insertPos + register.length - 1;
      message = 'Pasted after cursor';
    } else if (command === 'P') {
      // Paste before cursor
      newLines[cursorPos.row] = line.slice(0, cursorPos.col) + register + line.slice(cursorPos.col);
      newCursorPos.col = cursorPos.col + register.length - 1;
      message = 'Pasted before cursor';
    }
  }

  return { newLines, newCursorPos, message };
}

// Check completion for different task types
export function checkTaskCompletion(lesson, textLines, cursorPos, startTime, mistakes, undoPerformed = false) {
  // Position-based completion
  if (lesson.targetPosition) {
    if (cursorPos.row === lesson.targetPosition.row &&
        cursorPos.col === lesson.targetPosition.col) {
      return createCompletionResult(lesson.id, startTime, mistakes);
    }
  }

  // Insert task completion
  if (lesson.task === 'insert' && lesson.targetText) {
    const allText = textLines.join(' ');

    // If targetCount is specified, count occurrences
    if (lesson.targetCount) {
      const regex = new RegExp(lesson.targetText, 'gi');
      const matches = allText.match(regex);
      const count = matches ? matches.length : 0;

      if (count >= lesson.targetCount) {
        return createCompletionResult(lesson.id, startTime, mistakes);
      }
    } else {
      // Otherwise, just check if it appears at least once
      if (allText.includes(lesson.targetText)) {
        return createCompletionResult(lesson.id, startTime, mistakes);
      }
    }
  }

  // Delete task completion
  if (lesson.task === 'delete' && lesson.targetState) {
    const currentState = textLines.filter(line => line.trim() !== '');
    const targetState = lesson.targetState;
    if (JSON.stringify(currentState) === JSON.stringify(targetState)) {
      return createCompletionResult(lesson.id, startTime, mistakes);
    }
  }

  // Undo task completion - check if text matches initial state AND undo was performed
  if (lesson.task === 'undo' && lesson.initialText) {
    if (undoPerformed && JSON.stringify(textLines) === JSON.stringify(lesson.initialText)) {
      return createCompletionResult(lesson.id, startTime, mistakes);
    }
  }

  // Copy task completion - check if any line has been duplicated
  if (lesson.task === 'copy') {
    // Check if there are duplicate lines (indicating successful yank and paste)
    const lineCounts = {};
    for (const line of textLines) {
      if (line.trim()) { // Ignore empty lines
        lineCounts[line] = (lineCounts[line] || 0) + 1;
      }
    }
    // If any line appears more than once, task is complete
    for (const count of Object.values(lineCounts)) {
      if (count > 1) {
        return createCompletionResult(lesson.id, startTime, mistakes);
      }
    }
  }

  // Replace task completion - check if text matches target state or has changed
  if (lesson.task === 'replace') {
    if (lesson.targetState) {
      // If targetState is defined, check for exact match
      if (JSON.stringify(textLines) === JSON.stringify(lesson.targetState)) {
        return createCompletionResult(lesson.id, startTime, mistakes);
      }
    } else if (lesson.initialText) {
      // Otherwise just check if anything changed from initial
      if (JSON.stringify(textLines) !== JSON.stringify(lesson.initialText)) {
        return createCompletionResult(lesson.id, startTime, mistakes);
      }
    }
  }

  return null;
}

function createCompletionResult(lessonId, startTime, mistakes) {
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const score = Math.max(100 - mistakes * 10, 0);
  return { lessonId, completed: true, score, timeTaken, mistakes };
}

// Search functionality
export function findMatches(textLines, searchTerm, cursorPos, direction = 'forward') {
  if (!searchTerm) return { matches: [], currentIndex: -1 };

  const matches = [];

  // Find all matches in the text
  textLines.forEach((line, rowIndex) => {
    let colIndex = 0;
    while (colIndex < line.length) {
      const index = line.toLowerCase().indexOf(searchTerm.toLowerCase(), colIndex);
      if (index === -1) break;
      matches.push({ row: rowIndex, col: index });
      colIndex = index + 1;
    }
  });

  if (matches.length === 0) {
    return { matches: [], currentIndex: -1 };
  }

  // Find the first match after current cursor position
  let currentIndex = 0;
  if (direction === 'forward') {
    currentIndex = matches.findIndex(
      match => match.row > cursorPos.row ||
              (match.row === cursorPos.row && match.col > cursorPos.col)
    );
    // If no match found after cursor, wrap to first match
    if (currentIndex === -1) currentIndex = 0;
  } else {
    // For backward search, find last match before cursor
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      if (match.row < cursorPos.row ||
         (match.row === cursorPos.row && match.col < cursorPos.col)) {
        currentIndex = i;
        break;
      }
    }
    // If no match found before cursor, wrap to last match
    if (currentIndex === 0 && (matches[0].row > cursorPos.row ||
       (matches[0].row === cursorPos.row && matches[0].col >= cursorPos.col))) {
      currentIndex = matches.length - 1;
    }
  }

  return { matches, currentIndex };
}
