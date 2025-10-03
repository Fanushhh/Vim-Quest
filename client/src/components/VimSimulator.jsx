import { useState, useEffect, useCallback } from 'react';
import './VimSimulator.css';

function VimSimulator({ lesson, onComplete }) {
  const [cursorPos, setCursorPos] = useState({ row: 0, col: 0 });
  const [mode, setMode] = useState('normal'); // normal, insert, visual
  const [textLines, setTextLines] = useState([...lesson.initialText]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [pendingCommand, setPendingCommand] = useState('');
  const [visualStart, setVisualStart] = useState(null);

  const showMessage = (msg, duration = 0) => {
    setMessage(msg);
    if (duration > 0) {
      setTimeout(() => setMessage(''), duration);
    }
  };

  const checkCompletion = useCallback((currentPos) => {
    if (!lesson.targetPosition) return false;

    return (
      currentPos.row === lesson.targetPosition.row &&
      currentPos.col === lesson.targetPosition.col
    );
  }, [lesson]);

  const handleCommand = useCallback((command) => {
    if (!lesson.allowedCommands.includes(command)) {
      setMistakes(m => m + 1);
      showMessage(`Command '${command}' not allowed in this lesson!`);
      return;
    }

    setCommandHistory(prev => [...prev, command]);
    let newPos = { ...cursorPos };
    let newMode = mode;

    // Handle movement commands
    switch(command) {
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
        const afterCursorW = lineW.slice(cursorPos.col + 1);
        // Find next word start: skip current word, skip spaces, land on next word
        const matchW = afterCursorW.match(/\s+\S/);
        if (matchW) {
          newPos.col = cursorPos.col + 1 + matchW.index + matchW[0].length - 1;
        } else {
          // No more words, go to end of line
          newPos.col = Math.max(0, lineW.length - 1);
        }
        break;
      case 'b': // word backward
        const lineB = textLines[cursorPos.row] || '';
        const beforeCursorB = lineB.slice(0, cursorPos.col);
        // Find previous word start: go backwards
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
      case 'i': // insert mode
        newMode = 'insert';
        showMessage('-- INSERT --');
        break;
      case 'a': // append
        newPos.col = Math.min(textLines[cursorPos.row]?.length || 0, cursorPos.col + 1);
        newMode = 'insert';
        showMessage('-- INSERT --');
        break;
      case 'ESC': // escape to normal mode
        newMode = 'normal';
        setVisualStart(null);
        showMessage('');
        break;
      case 'v': // visual mode
        if (mode === 'visual') {
          // Already in visual mode, exit
          newMode = 'normal';
          setVisualStart(null);
          showMessage('');
        } else {
          // Enter visual mode
          newMode = 'visual';
          setVisualStart({ ...cursorPos });
          showMessage('-- VISUAL --');
        }
        break;
      case 'd': // delete in visual mode
        if (mode === 'visual' && visualStart) {
          const newLinesVisual = [...textLines];
          const start = Math.min(visualStart.col, cursorPos.col);
          const end = Math.max(visualStart.col, cursorPos.col) + 1;
          const line = newLinesVisual[cursorPos.row];

          if (line && visualStart.row === cursorPos.row) {
            newLinesVisual[cursorPos.row] = line.slice(0, start) + line.slice(end);
            setTextLines(newLinesVisual);
            newPos.col = start;
            newMode = 'normal';
            setVisualStart(null);
            showMessage('Deleted selection');
          }
        }
        break;
      case 'x': // delete character under cursor
        const newLinesX = [...textLines];
        const lineX = newLinesX[cursorPos.row];
        if (lineX && cursorPos.col < lineX.length) {
          newLinesX[cursorPos.row] = lineX.slice(0, cursorPos.col) + lineX.slice(cursorPos.col + 1);
          setTextLines(newLinesX);
          showMessage('Deleted character');
        }
        break;
      case 'dd': // delete entire line
        const newLinesDD = [...textLines];
        newLinesDD.splice(cursorPos.row, 1);
        if (newLinesDD.length === 0) {
          newLinesDD.push('');
        }
        setTextLines(newLinesDD);
        newPos.row = Math.min(cursorPos.row, newLinesDD.length - 1);
        newPos.col = 0;
        showMessage('Deleted line');
        break;
      case 'dw': // delete word
        const newLinesDW = [...textLines];
        const lineDW = newLinesDW[cursorPos.row];
        if (lineDW) {
          // Find the end of the current word (simplified)
          const restOfLine = lineDW.slice(cursorPos.col);
          const match = restOfLine.match(/^\S+\s*/);
          if (match) {
            newLinesDW[cursorPos.row] =
              lineDW.slice(0, cursorPos.col) +
              lineDW.slice(cursorPos.col + match[0].length);
            setTextLines(newLinesDW);
            showMessage('Deleted word');
          }
        }
        break;
      case 'd$': // delete to end of line
        const newLinesD$ = [...textLines];
        const lineD$ = newLinesD$[cursorPos.row];
        if (lineD$) {
          newLinesD$[cursorPos.row] = lineD$.slice(0, cursorPos.col);
          setTextLines(newLinesD$);
          showMessage('Deleted to end of line');
        }
        break;
      default:
        break;
    }

    setCursorPos(newPos);
    setMode(newMode);

    // Check if reached target
    if (checkCompletion(newPos)) {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.max(100 - mistakes * 10, 0);
      showMessage('🎉 Lesson Complete!', 3000);
      setTimeout(() => {
        onComplete({ lessonId: lesson.id, completed: true, score, timeTaken, mistakes });
      }, 2000);
    }

  }, [cursorPos, mode, textLines, lesson, mistakes, checkCompletion, onComplete, startTime]);

  // Check for delete task completion whenever textLines changes
  useEffect(() => {
    if (lesson.task === 'delete' && lesson.targetState) {
      const currentState = textLines.filter(line => line.trim() !== '');
      const targetState = lesson.targetState;

      if (JSON.stringify(currentState) === JSON.stringify(targetState)) {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const score = Math.max(100 - mistakes * 10, 0);
        showMessage('🎉 Lesson Complete!', 3000);
        setTimeout(() => {
          onComplete({ lessonId: lesson.id, completed: true, score, timeTaken, mistakes });
        }, 2000);
      }
    }
  }, [textLines, lesson, startTime, mistakes, onComplete]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (mode === 'insert') {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleCommand('ESC');
          return;
        }

        // Handle text input in insert mode
        if (e.key.length === 1) {
          e.preventDefault();
          const newLines = [...textLines];
          const line = newLines[cursorPos.row];
          newLines[cursorPos.row] =
            line.slice(0, cursorPos.col) + e.key + line.slice(cursorPos.col);
          setTextLines(newLines);
          setCursorPos({ ...cursorPos, col: cursorPos.col + 1 });

          // Check if target text is achieved for insert tasks
          if (lesson.task === 'insert' && lesson.targetText) {
            const allText = newLines.join(' ');
            if (allText.includes(lesson.targetText)) {
              const timeTaken = Math.floor((Date.now() - startTime) / 1000);
              const score = Math.max(100 - mistakes * 10, 0);
              showMessage('🎉 Lesson Complete!', 3000);
              setTimeout(() => {
                onComplete({ lessonId: lesson.id, completed: true, score, timeTaken, mistakes });
              }, 2000);
            }
          }
        }
        return;
      }

      e.preventDefault();

      // Handle multi-character commands (dd, dw, d$, gg, etc.)
      const currentKey = e.key;

      if (pendingCommand === 'd') {
        if (currentKey === 'd') {
          handleCommand('dd');
          setPendingCommand('');
          return;
        } else if (currentKey === 'w') {
          handleCommand('dw');
          setPendingCommand('');
          return;
        } else if (currentKey === '$') {
          handleCommand('d$');
          setPendingCommand('');
          return;
        } else {
          setPendingCommand('');
        }
      }

      if (pendingCommand === 'g') {
        if (currentKey === 'g') {
          handleCommand('gg');
          setPendingCommand('');
          return;
        } else {
          setPendingCommand('');
        }
      }

      // Check if starting a multi-character command
      if (currentKey === 'd') {
        setPendingCommand('d');
        showMessage('d', 1000);
        return;
      }

      if (currentKey === 'g') {
        setPendingCommand('g');
        showMessage('g', 1000);
        return;
      }

      // Map key presses to commands
      const keyMap = {
        'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l',
        'w': 'w', 'b': 'b', 'e': 'e',
        '0': '0', '$': '$', '^': '^',
        'i': 'i', 'a': 'a', 'o': 'o',
        'Escape': 'ESC',
        'v': 'v', 'V': 'V',
        'G': 'G',
        'u': 'u',
        'x': 'x',
        'r': 'r', 'R': 'R',
        'y': 'y', 'p': 'p', 'P': 'P',
        '/': '/',
        'n': 'n', 'N': 'N',
        'm': 'm',
        "'": "'"
      };

      if (currentKey in keyMap) {
        handleCommand(keyMap[currentKey]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleCommand, mode, cursorPos, textLines, lesson, mistakes, onComplete, startTime, pendingCommand]);

  return (
    <div className="vim-simulator">
      <div className="vim-header">
        <div className="vim-mode">Mode: {mode.toUpperCase()}</div>
        <div className="vim-stats">
          <span className="lesson-indicator">Lesson {lesson.id}</span>
          <span>Mistakes: {mistakes}</span>
          <span>Position: {cursorPos.row}:{cursorPos.col}</span>
        </div>
      </div>

      <div className="vim-editor">
        {textLines.map((line, rowIdx) => (
          <div key={rowIdx} className="vim-line">
            <span className="line-number">{rowIdx + 1}</span>
            <span className="line-content">
              {line.split('').map((char, colIdx) => {
                const isCursor = cursorPos.row === rowIdx && cursorPos.col === colIdx;
                const isTarget = lesson.targetPosition &&
                  lesson.targetPosition.row === rowIdx &&
                  lesson.targetPosition.col === colIdx;

                // Check if in visual selection
                const isSelected = mode === 'visual' && visualStart &&
                  visualStart.row === rowIdx && cursorPos.row === rowIdx &&
                  colIdx >= Math.min(visualStart.col, cursorPos.col) &&
                  colIdx <= Math.max(visualStart.col, cursorPos.col);

                return (
                  <span
                    key={colIdx}
                    className={`char ${isCursor ? 'cursor' : ''} ${isTarget ? 'target' : ''} ${isSelected ? 'selected' : ''}`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="vim-footer">
        <div className="vim-message">{message || '\u00A0'}</div>
        <div className="vim-hints">
          <div className="hint-title">💡 Hints:</div>
          {lesson.hints.map((hint, idx) => (
            <div key={idx} className="hint">• {hint}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VimSimulator;
