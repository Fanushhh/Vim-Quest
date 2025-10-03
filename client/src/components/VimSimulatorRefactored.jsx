import { useState, useEffect } from 'react';
import { useVimState } from '../hooks/useVimState';
import { moveCursor, deleteText, insertText, checkTaskCompletion, findMatches, yankText, pasteText, replaceText } from '../utils/vimCommands';
import VimEditor from './VimEditor';
import VimHeader from './VimHeader';
import VimFooter from './VimFooter';
import DebugPanel from './DebugPanel';
import CompletionEffects from './CompletionEffects';
import { shopItems } from '../data/shop';
import './VimSimulator.css';

function VimSimulatorRefactored({ lesson, onComplete, onNextLesson, onBackToLessons, editorStyle, completionEffect }) {
  const [state, dispatch] = useVimState(lesson.initialText);
  const [startTime, setStartTime] = useState(Date.now());
  const [completionTriggered, setCompletionTriggered] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [searchDirection, setSearchDirection] = useState('forward');
  const [undoPerformed, setUndoPerformed] = useState(false);
  const [waitingForReplaceChar, setWaitingForReplaceChar] = useState(false);
  const [waitingForMarkName, setWaitingForMarkName] = useState(false);
  const [waitingForJumpMark, setWaitingForJumpMark] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(0);

  // Reset all state when lesson changes
  useEffect(() => {
    setStartTime(Date.now());
    setCompletionTriggered(false);
    setCompletionData(null);
    setHasUserInteracted(false);
    setErrors([]);
    setSearchDirection('forward');
    setUndoPerformed(false);
    setWaitingForReplaceChar(false);
    setWaitingForMarkName(false);
    setWaitingForJumpMark(false);
  }, [lesson.id]); // Reset when lesson ID changes

  const showMessage = (msg, duration = 0) => {
    dispatch({ type: 'SET_MESSAGE', payload: msg });
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: '' }), duration);
    }
  };

  const logError = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setErrors(prev => [...prev, { timestamp, message }]);
  };

  const handleCommand = (command) => {
    // Mark that user has interacted
    setHasUserInteracted(true);

    // Check if command is allowed
    if (!lesson.allowedCommands.includes(command)) {
      dispatch({ type: 'INCREMENT_MISTAKES' });
      const errorMsg = `Command '${command}' not allowed in this lesson!`;
      showMessage(errorMsg);
      logError(errorMsg);
      return;
    }

    dispatch({ type: 'ADD_COMMAND_HISTORY', payload: command });

    // Handle mode switches
    if (command === 'ESC') {
      dispatch({ type: 'EXIT_TO_NORMAL' });
      return;
    }

    if (command === 'i') {
      dispatch({ type: 'ENTER_INSERT_MODE' });
      return;
    }

    if (command === 'a') {
      const newCol = Math.min(
        state.textLines[state.cursorPos.row]?.length || 0,
        state.cursorPos.col + 1
      );
      dispatch({ type: 'SET_CURSOR', payload: { ...state.cursorPos, col: newCol } });
      dispatch({ type: 'ENTER_INSERT_MODE' });
      return;
    }

    if (command === 'o') {
      // Open line below
      dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
      const newLines = [...state.textLines];
      newLines.splice(state.cursorPos.row + 1, 0, '');
      dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
      dispatch({ type: 'SET_CURSOR', payload: { row: state.cursorPos.row + 1, col: 0 } });
      dispatch({ type: 'ENTER_INSERT_MODE' });
      return;
    }

    if (command === 'O') {
      // Open line above
      dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
      const newLines = [...state.textLines];
      newLines.splice(state.cursorPos.row, 0, '');
      dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
      dispatch({ type: 'SET_CURSOR', payload: { row: state.cursorPos.row, col: 0 } });
      dispatch({ type: 'ENTER_INSERT_MODE' });
      return;
    }

    if (command === 'A') {
      // Append at end of line
      const endCol = state.textLines[state.cursorPos.row]?.length || 0;
      dispatch({ type: 'SET_CURSOR', payload: { ...state.cursorPos, col: endCol } });
      dispatch({ type: 'ENTER_INSERT_MODE' });
      return;
    }

    if (command === 'I') {
      // Insert at beginning of line (first non-blank)
      const currentLine = state.textLines[state.cursorPos.row] || '';
      const firstNonBlank = currentLine.search(/\S/);
      const newCol = firstNonBlank === -1 ? 0 : firstNonBlank;
      dispatch({ type: 'SET_CURSOR', payload: { ...state.cursorPos, col: newCol } });
      dispatch({ type: 'ENTER_INSERT_MODE' });
      return;
    }

    if (command === 'v') {
      if (state.mode === 'visual' || state.mode === 'visual-line') {
        dispatch({ type: 'EXIT_TO_NORMAL' });
      } else {
        dispatch({ type: 'ENTER_VISUAL_MODE', payload: { ...state.cursorPos } });
      }
      return;
    }

    if (command === 'V') {
      if (state.mode === 'visual-line') {
        dispatch({ type: 'EXIT_TO_NORMAL' });
      } else {
        dispatch({ type: 'ENTER_VISUAL_LINE_MODE', payload: { ...state.cursorPos } });
      }
      return;
    }

    // Handle search commands
    if (command === '/') {
      setSearchDirection('forward');
      dispatch({ type: 'ENTER_SEARCH_MODE', payload: { direction: 'forward' } });
      return;
    }

    if (command === '?') {
      setSearchDirection('backward');
      dispatch({ type: 'ENTER_SEARCH_MODE', payload: { direction: 'backward' } });
      return;
    }

    if (command === 'n') {
      if (state.searchMatches.length > 0) {
        dispatch({ type: 'NEXT_MATCH' });
        const nextIndex = (state.currentMatchIndex + 1) % state.searchMatches.length;
        const nextMatch = state.searchMatches[nextIndex];
        dispatch({ type: 'SET_CURSOR', payload: nextMatch });
        showMessage(`Match ${nextIndex + 1} of ${state.searchMatches.length}`, 2000);
      } else {
        showMessage('No previous search', 2000);
      }
      return;
    }

    if (command === 'N') {
      if (state.searchMatches.length > 0) {
        dispatch({ type: 'PREV_MATCH' });
        const prevIndex = state.currentMatchIndex - 1 < 0
          ? state.searchMatches.length - 1
          : state.currentMatchIndex - 1;
        const prevMatch = state.searchMatches[prevIndex];
        dispatch({ type: 'SET_CURSOR', payload: prevMatch });
        showMessage(`Match ${prevIndex + 1} of ${state.searchMatches.length}`, 2000);
      } else {
        showMessage('No previous search', 2000);
      }
      return;
    }

    // Handle undo command
    if (command === 'u') {
      dispatch({ type: 'UNDO' });
      setUndoPerformed(true); // Track that undo was performed
      showMessage('Undo', 1000);
      return;
    }

    // Handle redo command
    if (command === 'ctrl+r') {
      dispatch({ type: 'REDO' });
      showMessage('Redo', 1000);
      return;
    }

    // Handle yank commands
    if (['y', 'yy', 'yw'].includes(command)) {
      const result = yankText(
        state.textLines,
        state.cursorPos,
        command,
        state.visualStart,
        state.mode
      );

      if (result.content) {
        dispatch({
          type: 'SET_REGISTER',
          payload: { content: result.content, type: result.type }
        });
        showMessage(result.message, 2000);
      }

      if (state.mode === 'visual' || state.mode === 'visual-line') {
        dispatch({ type: 'EXIT_TO_NORMAL' });
      }
      return;
    }

    // Handle replace commands
    if (command === 'r') {
      setWaitingForReplaceChar(true);
      showMessage('r_', 0);
      return;
    }

    if (command === 'R') {
      dispatch({ type: 'ENTER_REPLACE_MODE' });
      return;
    }

    if (command === 'cw') {
      dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
      const result = replaceText(state.textLines, state.cursorPos, 'cw');
      dispatch({ type: 'SET_TEXT_LINES', payload: result.newLines });
      dispatch({ type: 'ENTER_INSERT_MODE' });
      showMessage(result.message, 1000);
      return;
    }

    // Handle paste commands
    if (['p', 'P'].includes(command)) {
      // Save state before paste for undo
      dispatch({ type: 'SAVE_STATE_FOR_UNDO' });

      const result = pasteText(
        state.textLines,
        state.cursorPos,
        state.register,
        state.registerType,
        command
      );

      dispatch({ type: 'SET_TEXT_LINES', payload: result.newLines });
      dispatch({ type: 'SET_CURSOR', payload: result.newCursorPos });
      showMessage(result.message, 2000);
      return;
    }

    // Handle delete commands
    if (['x', 'dd', 'dw', 'd$', 'd'].includes(command)) {
      // Save state before delete for undo
      dispatch({ type: 'SAVE_STATE_FOR_UNDO' });

      const result = deleteText(
        state.textLines,
        state.cursorPos,
        command,
        state.visualStart,
        state.mode
      );

      dispatch({ type: 'SET_TEXT_LINES', payload: result.newLines });
      dispatch({ type: 'SET_CURSOR', payload: result.newCursorPos });

      if (state.mode === 'visual' || state.mode === 'visual-line') {
        dispatch({ type: 'EXIT_TO_NORMAL' });
      }

      if (result.message) {
        showMessage(result.message);
      }
      return;
    }

    // Handle mark commands
    if (command === 'm') {
      setWaitingForMarkName(true);
      showMessage('m_', 0);
      return;
    }

    if (command === "'") {
      setWaitingForJumpMark(true);
      showMessage("'_", 0);
      return;
    }

    // Handle movement commands
    const movementCommands = ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}'];
    if (movementCommands.includes(command)) {
      const newPos = moveCursor(state.cursorPos, state.textLines, command);
      dispatch({ type: 'SET_CURSOR', payload: newPos });
      return;
    }
  };

  // Check for completion whenever state changes
  useEffect(() => {
    // Only check completion if user has interacted with the lesson
    if (!hasUserInteracted || completionTriggered) return;

    const result = checkTaskCompletion(
      lesson,
      state.textLines,
      state.cursorPos,
      startTime,
      state.mistakes,
      undoPerformed,
      state.marks
    );

    if (result) {
      setCompletionTriggered(true);
      setCompletionData(result);
      setTriggerEffect(prev => prev + 1); // Trigger completion effect
      showMessage('🎉 Lesson Complete!');
      // Save progress immediately without redirecting
      onComplete(result);
    }
  }, [state.textLines, state.cursorPos, lesson, startTime, state.mistakes, onComplete, completionTriggered, undoPerformed, hasUserInteracted]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Waiting for mark name
      if (waitingForMarkName) {
        if (/^[a-z]$/.test(e.key)) {
          e.preventDefault();
          dispatch({
            type: 'SET_MARK',
            payload: { mark: e.key, position: { ...state.cursorPos } }
          });
          showMessage(`Mark '${e.key}' set`, 1000);
          setWaitingForMarkName(false);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setWaitingForMarkName(false);
          showMessage('', 0);
        }
        return;
      }

      // Waiting for jump mark
      if (waitingForJumpMark) {
        if (/^[a-z]$/.test(e.key)) {
          e.preventDefault();
          const mark = state.marks[e.key];
          if (mark) {
            dispatch({ type: 'SET_CURSOR', payload: mark });
            showMessage(`Jumped to mark '${e.key}'`, 1000);
          } else {
            showMessage(`Mark '${e.key}' not set`, 2000);
          }
          setWaitingForJumpMark(false);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setWaitingForJumpMark(false);
          showMessage('', 0);
        }
        return;
      }

      // Waiting for replace character
      if (waitingForReplaceChar) {
        if (e.key.length === 1) {
          e.preventDefault();
          dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
          const result = replaceText(state.textLines, state.cursorPos, 'r', e.key);
          dispatch({ type: 'SET_TEXT_LINES', payload: result.newLines });
          showMessage(result.message, 1000);
          setWaitingForReplaceChar(false);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setWaitingForReplaceChar(false);
          showMessage('', 0);
        }
        return;
      }

      // Replace mode (R command)
      if (state.mode === 'replace') {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleCommand('ESC');
          return;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          // Move cursor back in replace mode (doesn't delete)
          if (state.cursorPos.col > 0) {
            dispatch({
              type: 'SET_CURSOR',
              payload: { ...state.cursorPos, col: state.cursorPos.col - 1 }
            });
          }
          return;
        }

        if (e.key.length === 1) {
          e.preventDefault();
          const line = state.textLines[state.cursorPos.row];
          const newLines = [...state.textLines];

          if (state.cursorPos.col < line.length) {
            // Replace character at cursor
            newLines[state.cursorPos.row] =
              line.slice(0, state.cursorPos.col) + e.key + line.slice(state.cursorPos.col + 1);
          } else {
            // Append if at end of line
            newLines[state.cursorPos.row] = line + e.key;
          }

          dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
          dispatch({
            type: 'SET_CURSOR',
            payload: { ...state.cursorPos, col: state.cursorPos.col + 1 }
          });
        }
        return;
      }

      // Search mode
      if (state.mode === 'search') {
        setHasUserInteracted(true);

        if (e.key === 'Escape') {
          e.preventDefault();
          dispatch({ type: 'EXIT_TO_NORMAL' });
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          // Perform search and move to first match
          const result = findMatches(state.textLines, state.searchTerm, state.cursorPos, searchDirection);
          dispatch({ type: 'SET_SEARCH_MATCHES', payload: { matches: result.matches, currentIndex: result.currentIndex } });

          if (result.matches.length > 0) {
            dispatch({ type: 'SET_CURSOR', payload: result.matches[result.currentIndex] });
            dispatch({ type: 'SET_MODE', payload: 'normal' });
            showMessage(`Match 1 of ${result.matches.length}`, 2000);
          } else {
            dispatch({ type: 'SET_MODE', payload: 'normal' });
            showMessage('Pattern not found', 2000);
          }
          return;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          const newTerm = state.searchTerm.slice(0, -1);
          dispatch({ type: 'SET_SEARCH_TERM', payload: newTerm });
          dispatch({ type: 'SET_MESSAGE', payload: (searchDirection === 'forward' ? '/' : '?') + newTerm });
          return;
        }

        if (e.key.length === 1) {
          e.preventDefault();
          const newTerm = state.searchTerm + e.key;
          dispatch({ type: 'SET_SEARCH_TERM', payload: newTerm });
          dispatch({ type: 'SET_MESSAGE', payload: (searchDirection === 'forward' ? '/' : '?') + newTerm });
        }
        return;
      }

      // Insert mode
      if (state.mode === 'insert') {
        setHasUserInteracted(true);

        if (e.key === 'Escape') {
          e.preventDefault();
          handleCommand('ESC');
          return;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          if (state.cursorPos.col > 0) {
            const newLines = [...state.textLines];
            const line = newLines[state.cursorPos.row];
            newLines[state.cursorPos.row] = line.slice(0, state.cursorPos.col - 1) + line.slice(state.cursorPos.col);
            dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
            dispatch({
              type: 'SET_CURSOR',
              payload: { ...state.cursorPos, col: state.cursorPos.col - 1 }
            });
          }
          return;
        }

        if (e.key.length === 1) {
          e.preventDefault();
          const newLines = insertText(state.textLines, state.cursorPos, e.key);
          dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
          dispatch({
            type: 'SET_CURSOR',
            payload: { ...state.cursorPos, col: state.cursorPos.col + 1 }
          });
        }
        return;
      }

      e.preventDefault();

      // Handle Ctrl+r for redo
      if (e.ctrlKey && e.key === 'r') {
        handleCommand('ctrl+r');
        return;
      }

      // Handle multi-character commands
      if (state.pendingCommand === 'd') {
        if (e.key === 'd') {
          handleCommand('dd');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        } else if (e.key === 'w') {
          handleCommand('dw');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        } else if (e.key === '$') {
          handleCommand('d$');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
      }

      if (state.pendingCommand === 'g') {
        if (e.key === 'g') {
          handleCommand('gg');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
      }

      if (state.pendingCommand === 'y') {
        if (e.key === 'y') {
          handleCommand('yy');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        } else if (e.key === 'w') {
          handleCommand('yw');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
      }

      if (state.pendingCommand === 'c') {
        if (e.key === 'w') {
          handleCommand('cw');
          dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
          return;
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
      }

      // Start multi-character commands (but not in visual mode)
      if (e.key === 'd') {
        // In visual mode, 'd' deletes the selection immediately
        if (state.mode === 'visual' || state.mode === 'visual-line') {
          handleCommand('d');
          return;
        }
        // In normal mode, 'd' starts a multi-character command
        dispatch({ type: 'SET_PENDING_COMMAND', payload: 'd' });
        showMessage('d', 1000);
        return;
      }

      if (e.key === 'y') {
        // In visual mode, 'y' yanks the selection immediately
        if (state.mode === 'visual' || state.mode === 'visual-line') {
          handleCommand('y');
          return;
        }
        // In normal mode, 'y' starts a multi-character command
        dispatch({ type: 'SET_PENDING_COMMAND', payload: 'y' });
        showMessage('y', 1000);
        return;
      }

      if (e.key === 'c') {
        // In normal mode, 'c' starts a multi-character command (cw, etc)
        dispatch({ type: 'SET_PENDING_COMMAND', payload: 'c' });
        showMessage('c', 1000);
        return;
      }

      if (e.key === 'g') {
        dispatch({ type: 'SET_PENDING_COMMAND', payload: 'g' });
        showMessage('g', 1000);
        return;
      }

      // Single-key commands
      const keyMap = {
        'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l',
        'w': 'w', 'b': 'b', 'e': 'e',
        '0': '0', '$': '$', '^': '^',
        'i': 'i', 'a': 'a', 'o': 'o', 'O': 'O',
        'A': 'A', 'I': 'I',
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
        "'": "'",
        '{': '{', '}': '}',
        'c': 'c'
      };

      if (e.key in keyMap) {
        handleCommand(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state, handleCommand]);

  return (
    <div className="vim-simulator">
      <button className="back-to-lessons-btn" onClick={onBackToLessons}>
        ← Back to Lessons
      </button>

      <VimHeader mode={state.mode} mistakes={state.mistakes} cursorPos={state.cursorPos} lessonNumber={lesson.id} />

      {!completionTriggered && (
        <div className="vim-objective-top">
          <span className="objective-label">🎯 Objective:</span>
          <span className="objective-text">{lesson.instructions}</span>
        </div>
      )}

      <VimEditor
        textLines={state.textLines}
        cursorPos={state.cursorPos}
        mode={state.mode}
        visualStart={state.visualStart}
        lesson={lesson}
        editorStyle={editorStyle}
      />

      <VimFooter
        message={state.message}
        hints={lesson.hints}
        isCompleted={completionTriggered}
        completionData={completionData}
        onNextLesson={onNextLesson}
        onBackToLessons={onBackToLessons}
      />

      <DebugPanel
        state={{
          mode: state.mode,
          cursorPos: state.cursorPos,
          mistakes: state.mistakes,
          textLines: state.textLines,
          visualStart: state.visualStart,
          pendingCommand: state.pendingCommand,
          searchTerm: state.searchTerm,
          searchMatches: state.searchMatches,
          currentMatchIndex: state.currentMatchIndex,
          undoStack: state.undoStack,
          redoStack: state.redoStack,
          register: state.register,
          registerType: state.registerType
        }}
        commandHistory={state.commandHistory}
        errors={errors}
      />

      <CompletionEffects effect={completionEffect} trigger={triggerEffect} />
    </div>
  );
}

export default VimSimulatorRefactored;
