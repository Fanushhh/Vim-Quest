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
        // Determine current character type
        const currentChar = lineW[newColW];
        const isAlphaNum = /[a-zA-Z0-9_]/.test(currentChar);

        if (isAlphaNum) {
          // Move to end of alphanumeric word
          while (newColW < lineW.length && /[a-zA-Z0-9_]/.test(lineW[newColW])) {
            newColW++;
          }
        } else {
          // Move past punctuation
          while (newColW < lineW.length && /[^\sa-zA-Z0-9_]/.test(lineW[newColW])) {
            newColW++;
          }
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
      let newColB = cursorPos.col;

      if (newColB === 0) break;

      // Move back one position
      newColB--;

      // Skip whitespace
      while (newColB > 0 && /\s/.test(lineB[newColB])) {
        newColB--;
      }

      if (newColB >= 0) {
        const charAtPos = lineB[newColB];
        const isAlphaNum = /[a-zA-Z0-9_]/.test(charAtPos);

        if (isAlphaNum) {
          // Move to beginning of alphanumeric word
          while (newColB > 0 && /[a-zA-Z0-9_]/.test(lineB[newColB - 1])) {
            newColB--;
          }
        } else {
          // Move to beginning of punctuation group
          while (newColB > 0 && /[^\sa-zA-Z0-9_]/.test(lineB[newColB - 1])) {
            newColB--;
          }
        }
      }

      newPos.col = Math.max(0, newColB);
      break;

    case 'e': // end of word
      const lineE = textLines[cursorPos.row] || '';
      let newColE = cursorPos.col;

      // Move forward one position
      newColE++;

      if (newColE >= lineE.length) {
        newPos.col = Math.max(0, lineE.length - 1);
        break;
      }

      // Skip whitespace
      while (newColE < lineE.length && /\s/.test(lineE[newColE])) {
        newColE++;
      }

      if (newColE < lineE.length) {
        const charAtPos = lineE[newColE];
        const isAlphaNum = /[a-zA-Z0-9_]/.test(charAtPos);

        if (isAlphaNum) {
          // Move to end of alphanumeric word
          while (newColE < lineE.length - 1 && /[a-zA-Z0-9_]/.test(lineE[newColE + 1])) {
            newColE++;
          }
        } else {
          // Move to end of punctuation group
          while (newColE < lineE.length - 1 && /[^\sa-zA-Z0-9_]/.test(lineE[newColE + 1])) {
            newColE++;
          }
        }
      }

      newPos.col = Math.min(lineE.length - 1, newColE);
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

  if (command === 'd' && mode === 'visual-line' && visualStart) {
    // Delete visual line selection (entire lines)
    const startRow = Math.min(visualStart.row, cursorPos.row);
    const endRow = Math.max(visualStart.row, cursorPos.row);
    const lineCount = endRow - startRow + 1;

    newLines.splice(startRow, lineCount);

    if (newLines.length === 0) {
      newLines.push('');
    }

    newCursorPos.row = Math.min(startRow, newLines.length - 1);
    newCursorPos.col = 0;
    message = `Deleted ${lineCount} line${lineCount > 1 ? 's' : ''}`;
  } else if (command === 'd' && mode === 'visual' && visualStart) {
    // Delete visual selection (character-wise)
    const start = Math.min(visualStart.col, cursorPos.col);
    const end = Math.max(visualStart.col, cursorPos.col);
    const line = newLines[cursorPos.row];

    if (line && visualStart.row === cursorPos.row) {
      // Visual mode delete: from start to end (inclusive, as in Vim's visual mode)
      const newLine = line.slice(0, start) + line.slice(end + 1);
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
    // Delete word (respecting word boundaries like Vim)
    const line = newLines[cursorPos.row];
    if (line) {
      let deleteCount = 0;
      let pos = cursorPos.col;
      const currentChar = line[pos];

      if (!currentChar) return { newLines, newCursorPos, message };

      // If on whitespace, delete to next word
      if (/\s/.test(currentChar)) {
        while (pos < line.length && /\s/.test(line[pos])) {
          pos++;
          deleteCount++;
        }
      } else {
        const isAlphaNum = /[a-zA-Z0-9_]/.test(currentChar);

        if (isAlphaNum) {
          // Delete alphanumeric word
          while (pos < line.length && /[a-zA-Z0-9_]/.test(line[pos])) {
            pos++;
            deleteCount++;
          }
        } else {
          // Delete punctuation
          while (pos < line.length && /[^\sa-zA-Z0-9_]/.test(line[pos])) {
            pos++;
            deleteCount++;
          }
        }

        // Also delete trailing whitespace
        while (pos < line.length && /\s/.test(line[pos])) {
          pos++;
          deleteCount++;
        }
      }

      if (deleteCount > 0) {
        newLines[cursorPos.row] =
          line.slice(0, cursorPos.col) +
          line.slice(cursorPos.col + deleteCount);
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
    // Yank word (respecting word boundaries like Vim)
    const line = textLines[cursorPos.row];
    let pos = cursorPos.col;
    const currentChar = line[pos];

    if (currentChar) {
      let startPos = pos;

      // If on whitespace, yank to next word
      if (/\s/.test(currentChar)) {
        while (pos < line.length && /\s/.test(line[pos])) {
          pos++;
        }
      } else {
        const isAlphaNum = /[a-zA-Z0-9_]/.test(currentChar);

        if (isAlphaNum) {
          // Yank alphanumeric word
          while (pos < line.length && /[a-zA-Z0-9_]/.test(line[pos])) {
            pos++;
          }
        } else {
          // Yank punctuation
          while (pos < line.length && /[^\sa-zA-Z0-9_]/.test(line[pos])) {
            pos++;
          }
        }

        // Also yank trailing whitespace
        while (pos < line.length && /\s/.test(line[pos])) {
          pos++;
        }
      }

      yankedContent = line.slice(startPos, pos);
      registerType = 'char';
    }
  } else if (command === 'y' && mode === 'visual' && visualStart) {
    // Yank visual selection
    if (visualStart.row === cursorPos.row) {
      const line = textLines[cursorPos.row];
      const start = Math.min(visualStart.col, cursorPos.col);
      const end = Math.max(visualStart.col, cursorPos.col);
      // Yank from start to end (inclusive, as in Vim's visual mode)
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
    // Change word (delete word and enter insert mode, respecting word boundaries)
    const line = newLines[cursorPos.row];
    if (line) {
      let deleteCount = 0;
      let pos = cursorPos.col;
      const currentChar = line[pos];

      if (currentChar) {
        // If on whitespace, delete to next word
        if (/\s/.test(currentChar)) {
          while (pos < line.length && /\s/.test(line[pos])) {
            pos++;
            deleteCount++;
          }
        } else {
          const isAlphaNum = /[a-zA-Z0-9_]/.test(currentChar);

          if (isAlphaNum) {
            // Delete alphanumeric word
            while (pos < line.length && /[a-zA-Z0-9_]/.test(line[pos])) {
              pos++;
              deleteCount++;
            }
          } else {
            // Delete punctuation
            while (pos < line.length && /[^\sa-zA-Z0-9_]/.test(line[pos])) {
              pos++;
              deleteCount++;
            }
          }

          // Also delete trailing whitespace
          while (pos < line.length && /\s/.test(line[pos])) {
            pos++;
            deleteCount++;
          }
        }

        if (deleteCount > 0) {
          newLines[cursorPos.row] =
            line.slice(0, cursorPos.col) +
            line.slice(cursorPos.col + deleteCount);
          message = 'Changed word';
          enterInsertMode = true;
        }
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
export function checkTaskCompletion(lesson, textLines, cursorPos, startTime, mistakes, undoPerformed = false, marks = {}) {
  // Position-based completion
  if (lesson.targetPosition) {
    if (cursorPos.row === lesson.targetPosition.row &&
        cursorPos.col === lesson.targetPosition.col) {
      return createCompletionResult(lesson.id, startTime, mistakes);
    }
  }

  // Marks task completion - check if required marks are set
  if (lesson.task === 'marks' && lesson.requiredMarks) {
    const allMarksSet = lesson.requiredMarks.every(markName => marks[markName] !== undefined);
    if (allMarksSet) {
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
    const currentState = textLines
      .filter(line => line.trim() !== '')
      .map(line => line.trimEnd()); // Remove trailing spaces for comparison
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
      // If targetState is defined, check for match (trim trailing spaces)
      const currentState = textLines.map(line => line.trimEnd());
      const targetState = lesson.targetState.map(line => line.trimEnd());
      if (JSON.stringify(currentState) === JSON.stringify(targetState)) {
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
