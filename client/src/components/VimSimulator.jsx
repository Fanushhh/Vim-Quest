import { useState, useEffect } from 'react';
import { useVimState } from '../hooks/useVimState';
import {
  moveCursor,
  deleteText,
  insertText,
  checkTaskCompletion,
  findMatches,
  yankText,
  pasteText,
  replaceText
} from '../utils/vimCommands';
import VimEditor from './VimEditor';
import VimHeader from './VimHeader';
import VimFooter from './VimFooter';
import DebugPanel from './DebugPanel';
import CompletionEffects from './CompletionEffects';
import './VimSimulator.css';

/**
 * Main Vim Simulator Component
 * Handles all Vim commands, modes, and lesson completion logic
 */
function VimSimulator({ lesson, onComplete, onNextLesson, onBackToLessons, editorStyle, completionEffect }) {
  // ========== STATE MANAGEMENT ==========
  const [state, dispatch] = useVimState(lesson.initialText);
  const [startTime, setStartTime] = useState(Date.now());
  const [completionTriggered, setCompletionTriggered] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [undoPerformed, setUndoPerformed] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(0);

  // Search state
  const [searchDirection, setSearchDirection] = useState('forward');

  // Special input waiting states
  const [waitingForReplaceChar, setWaitingForReplaceChar] = useState(false);
  const [waitingForMarkName, setWaitingForMarkName] = useState(false);
  const [waitingForJumpMark, setWaitingForJumpMark] = useState(false);

  // ========== RESET STATE ON LESSON CHANGE ==========
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
  }, [lesson.id]);

  // ========== HELPER FUNCTIONS ==========
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

  // ========== COMMAND HANDLERS ==========

  const handleModeCommands = (command) => {
    switch (command) {
      case 'ESC':
        dispatch({ type: 'EXIT_TO_NORMAL' });
        return true;

      case 'i':
        dispatch({ type: 'ENTER_INSERT_MODE' });
        return true;

      case 'a': {
        const newCol = Math.min(
          state.textLines[state.cursorPos.row]?.length || 0,
          state.cursorPos.col + 1
        );
        dispatch({ type: 'SET_CURSOR', payload: { ...state.cursorPos, col: newCol } });
        dispatch({ type: 'ENTER_INSERT_MODE' });
        return true;
      }

      case 'o': {
        dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
        const newLines = [...state.textLines];
        newLines.splice(state.cursorPos.row + 1, 0, '');
        dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
        dispatch({ type: 'SET_CURSOR', payload: { row: state.cursorPos.row + 1, col: 0 } });
        dispatch({ type: 'ENTER_INSERT_MODE' });
        return true;
      }

      case 'O': {
        dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
        const newLines = [...state.textLines];
        newLines.splice(state.cursorPos.row, 0, '');
        dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
        dispatch({ type: 'SET_CURSOR', payload: { row: state.cursorPos.row, col: 0 } });
        dispatch({ type: 'ENTER_INSERT_MODE' });
        return true;
      }

      case 'A': {
        const endCol = state.textLines[state.cursorPos.row]?.length || 0;
        dispatch({ type: 'SET_CURSOR', payload: { ...state.cursorPos, col: endCol } });
        dispatch({ type: 'ENTER_INSERT_MODE' });
        return true;
      }

      case 'I': {
        const currentLine = state.textLines[state.cursorPos.row] || '';
        const firstNonBlank = currentLine.search(/\S/);
        const newCol = firstNonBlank === -1 ? 0 : firstNonBlank;
        dispatch({ type: 'SET_CURSOR', payload: { ...state.cursorPos, col: newCol } });
        dispatch({ type: 'ENTER_INSERT_MODE' });
        return true;
      }

      case 'v':
        if (state.mode === 'visual' || state.mode === 'visual-line') {
          dispatch({ type: 'EXIT_TO_NORMAL' });
        } else {
          dispatch({ type: 'ENTER_VISUAL_MODE', payload: { ...state.cursorPos } });
        }
        return true;

      case 'V':
        if (state.mode === 'visual-line') {
          dispatch({ type: 'EXIT_TO_NORMAL' });
        } else {
          dispatch({ type: 'ENTER_VISUAL_LINE_MODE', payload: { ...state.cursorPos } });
        }
        return true;
    }
    return false;
  };

  const handleSearchCommands = (command) => {
    switch (command) {
      case '/':
        setSearchDirection('forward');
        dispatch({ type: 'ENTER_SEARCH_MODE', payload: { direction: 'forward' } });
        return true;

      case '?':
        setSearchDirection('backward');
        dispatch({ type: 'ENTER_SEARCH_MODE', payload: { direction: 'backward' } });
        return true;

      case 'n':
        if (state.searchMatches.length > 0) {
          dispatch({ type: 'NEXT_MATCH' });
          const nextIndex = (state.currentMatchIndex + 1) % state.searchMatches.length;
          const nextMatch = state.searchMatches[nextIndex];
          dispatch({ type: 'SET_CURSOR', payload: nextMatch });
          showMessage(`Match ${nextIndex + 1} of ${state.searchMatches.length}`, 2000);
        } else {
          showMessage('No previous search', 2000);
        }
        return true;

      case 'N':
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
        return true;
    }
    return false;
  };

  const handleUndoRedoCommands = (command) => {
    switch (command) {
      case 'u':
        dispatch({ type: 'UNDO' });
        setUndoPerformed(true);
        showMessage('Undo', 1000);
        return true;

      case 'ctrl+r':
        dispatch({ type: 'REDO' });
        showMessage('Redo', 1000);
        return true;
    }
    return false;
  };

  const handleYankCommands = (command) => {
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
      return true;
    }
    return false;
  };

  const handleReplaceCommands = (command) => {
    switch (command) {
      case 'r':
        setWaitingForReplaceChar(true);
        showMessage('r_', 0);
        return true;

      case 'R':
        dispatch({ type: 'ENTER_REPLACE_MODE' });
        return true;

      case 'cw':
        dispatch({ type: 'SAVE_STATE_FOR_UNDO' });
        const result = replaceText(state.textLines, state.cursorPos, 'cw');
        dispatch({ type: 'SET_TEXT_LINES', payload: result.newLines });
        dispatch({ type: 'ENTER_INSERT_MODE' });
        showMessage(result.message, 1000);
        return true;
    }
    return false;
  };

  const handlePasteCommands = (command) => {
    if (['p', 'P'].includes(command)) {
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
      return true;
    }
    return false;
  };

  const handleDeleteCommands = (command) => {
    if (['x', 'dd', 'dw', 'd$', 'd'].includes(command)) {
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
      return true;
    }
    return false;
  };

  const handleMarkCommands = (command) => {
    switch (command) {
      case 'm':
        setWaitingForMarkName(true);
        showMessage('m_', 0);
        return true;

      case "'":
        setWaitingForJumpMark(true);
        showMessage("'_", 0);
        return true;
    }
    return false;
  };

  const handleMovementCommands = (command) => {
    const movementCommands = ['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', '^', 'gg', 'G', '{', '}'];
    if (movementCommands.includes(command)) {
      const newPos = moveCursor(state.cursorPos, state.textLines, command, state.mode);
      dispatch({ type: 'SET_CURSOR', payload: newPos });
      return true;
    }
    return false;
  };

  // Main command handler
  const handleCommand = (command) => {
    setHasUserInteracted(true);

    // Check if command is allowed in this lesson
    if (!lesson.allowedCommands.includes(command)) {
      dispatch({ type: 'INCREMENT_MISTAKES' });
      const errorMsg = `Command '${command}' not allowed in this lesson!`;
      showMessage(errorMsg);
      logError(errorMsg);
      return;
    }

    dispatch({ type: 'ADD_COMMAND_HISTORY', payload: command });

    // Process command through different handlers
    if (handleModeCommands(command)) return;
    if (handleSearchCommands(command)) return;
    if (handleUndoRedoCommands(command)) return;
    if (handleYankCommands(command)) return;
    if (handleReplaceCommands(command)) return;
    if (handlePasteCommands(command)) return;
    if (handleDeleteCommands(command)) return;
    if (handleMarkCommands(command)) return;
    if (handleMovementCommands(command)) return;
  };

  // ========== COMPLETION CHECK ==========
  useEffect(() => {
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
      setTriggerEffect(prev => prev + 1);
      showMessage('🎉 Lesson Complete!');
      onComplete(result);
    }
  }, [state.textLines, state.cursorPos, lesson, startTime, state.mistakes, onComplete, completionTriggered, undoPerformed, hasUserInteracted, state.marks]);

  // ========== KEYBOARD EVENT HANDLING ==========
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Special input states
      if (handleMarkInput(e)) return;
      if (handleReplaceInput(e)) return;
      if (handleReplaceMode(e)) return;
      if (handleSearchMode(e)) return;
      if (handleInsertMode(e)) return;

      // Normal mode
      e.preventDefault();
      handleNormalMode(e);
    };

    const handleMarkInput = (e) => {
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
        return true;
      }

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
        return true;
      }
      return false;
    };

    const handleReplaceInput = (e) => {
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
        return true;
      }
      return false;
    };

    const handleReplaceMode = (e) => {
      if (state.mode === 'replace') {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleCommand('ESC');
          return true;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          if (state.cursorPos.col > 0) {
            dispatch({
              type: 'SET_CURSOR',
              payload: { ...state.cursorPos, col: state.cursorPos.col - 1 }
            });
          }
          return true;
        }

        if (e.key.length === 1) {
          e.preventDefault();
          const line = state.textLines[state.cursorPos.row];
          const newLines = [...state.textLines];

          if (state.cursorPos.col < line.length) {
            newLines[state.cursorPos.row] =
              line.slice(0, state.cursorPos.col) + e.key + line.slice(state.cursorPos.col + 1);
          } else {
            newLines[state.cursorPos.row] = line + e.key;
          }

          dispatch({ type: 'SET_TEXT_LINES', payload: newLines });
          dispatch({
            type: 'SET_CURSOR',
            payload: { ...state.cursorPos, col: state.cursorPos.col + 1 }
          });
        }
        return true;
      }
      return false;
    };

    const handleSearchMode = (e) => {
      if (state.mode === 'search') {
        setHasUserInteracted(true);

        if (e.key === 'Escape') {
          e.preventDefault();
          dispatch({ type: 'EXIT_TO_NORMAL' });
          return true;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
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
          return true;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          const newTerm = state.searchTerm.slice(0, -1);
          dispatch({ type: 'SET_SEARCH_TERM', payload: newTerm });
          dispatch({ type: 'SET_MESSAGE', payload: (searchDirection === 'forward' ? '/' : '?') + newTerm });
          return true;
        }

        if (e.key.length === 1) {
          e.preventDefault();
          const newTerm = state.searchTerm + e.key;
          dispatch({ type: 'SET_SEARCH_TERM', payload: newTerm });
          dispatch({ type: 'SET_MESSAGE', payload: (searchDirection === 'forward' ? '/' : '?') + newTerm });
        }
        return true;
      }
      return false;
    };

    const handleInsertMode = (e) => {
      if (state.mode === 'insert') {
        setHasUserInteracted(true);

        if (e.key === 'Escape') {
          e.preventDefault();
          handleCommand('ESC');
          return true;
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
          return true;
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
        return true;
      }
      return false;
    };

    const handleNormalMode = (e) => {
      // Ctrl+r for redo
      if (e.ctrlKey && e.key === 'r') {
        handleCommand('ctrl+r');
        return;
      }

      // Multi-character commands
      if (handleMultiCharCommands(e)) return;

      // Single-key command mapping
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

    const handleMultiCharCommands = (e) => {
      // Handle 'd' commands
      if (state.pendingCommand === 'd') {
        if (e.key === 'd') {
          handleCommand('dd');
        } else if (e.key === 'w') {
          handleCommand('dw');
        } else if (e.key === '$') {
          handleCommand('d$');
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
        return true;
      }

      // Handle 'g' commands
      if (state.pendingCommand === 'g') {
        if (e.key === 'g') {
          handleCommand('gg');
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
        return true;
      }

      // Handle 'y' commands
      if (state.pendingCommand === 'y') {
        if (e.key === 'y') {
          handleCommand('yy');
        } else if (e.key === 'w') {
          handleCommand('yw');
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
        return true;
      }

      // Handle 'c' commands
      if (state.pendingCommand === 'c') {
        if (e.key === 'w') {
          handleCommand('cw');
        }
        dispatch({ type: 'SET_PENDING_COMMAND', payload: '' });
        return true;
      }

      // Start multi-character commands
      if (e.key === 'd') {
        if (state.mode === 'visual' || state.mode === 'visual-line') {
          handleCommand('d');
        } else {
          dispatch({ type: 'SET_PENDING_COMMAND', payload: 'd' });
          showMessage('d', 1000);
        }
        return true;
      }

      if (e.key === 'y') {
        if (state.mode === 'visual' || state.mode === 'visual-line') {
          handleCommand('y');
        } else {
          dispatch({ type: 'SET_PENDING_COMMAND', payload: 'y' });
          showMessage('y', 1000);
        }
        return true;
      }

      if (e.key === 'c') {
        dispatch({ type: 'SET_PENDING_COMMAND', payload: 'c' });
        showMessage('c', 1000);
        return true;
      }

      if (e.key === 'g') {
        dispatch({ type: 'SET_PENDING_COMMAND', payload: 'g' });
        showMessage('g', 1000);
        return true;
      }

      return false;
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state, handleCommand, waitingForMarkName, waitingForJumpMark, waitingForReplaceChar, searchDirection]);

  // ========== RENDER ==========
  return (
    <div className="vim-simulator">
      <button className="back-to-lessons-btn" onClick={onBackToLessons}>
        ← Back to Lessons
      </button>

      <VimHeader
        mode={state.mode}
        mistakes={state.mistakes}
        cursorPos={state.cursorPos}
        lessonNumber={lesson.id}
      />

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

export default VimSimulator;
