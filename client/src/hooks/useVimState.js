import { useReducer, useEffect } from 'react';

const initialState = {
  cursorPos: { row: 0, col: 0 },
  mode: 'normal',
  textLines: [],
  message: '',
  mistakes: 0,
  pendingCommand: '',
  visualStart: null,
  commandHistory: [],
  searchTerm: '',
  searchMatches: [],
  currentMatchIndex: -1,
  undoStack: [],
  redoStack: [],
  register: '', // Clipboard/register for yank and paste
  registerType: 'char', // 'char' for character/word, 'line' for line
  marks: {} // Store marks { 'a': {row, col}, 'b': {row, col}, ... }
};

function vimReducer(state, action) {
  switch (action.type) {
    case 'INIT_TEXT':
      return { ...state, textLines: action.payload };

    case 'SET_CURSOR':
      return { ...state, cursorPos: action.payload };

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'SET_MESSAGE':
      return { ...state, message: action.payload };

    case 'INCREMENT_MISTAKES':
      return { ...state, mistakes: state.mistakes + 1 };

    case 'SET_PENDING_COMMAND':
      return { ...state, pendingCommand: action.payload };

    case 'SET_VISUAL_START':
      return { ...state, visualStart: action.payload };

    case 'SET_TEXT_LINES':
      return { ...state, textLines: action.payload };

    case 'ADD_COMMAND_HISTORY':
      return { ...state, commandHistory: [...state.commandHistory, action.payload] };

    case 'ENTER_INSERT_MODE':
      return { ...state, mode: 'insert', message: '-- INSERT --' };

    case 'ENTER_REPLACE_MODE':
      return { ...state, mode: 'replace', message: '-- REPLACE --' };

    case 'ENTER_VISUAL_MODE':
      return {
        ...state,
        mode: 'visual',
        visualStart: action.payload,
        message: '-- VISUAL --'
      };

    case 'ENTER_VISUAL_LINE_MODE':
      return {
        ...state,
        mode: 'visual-line',
        visualStart: action.payload,
        message: '-- VISUAL LINE --'
      };

    case 'EXIT_TO_NORMAL':
      return {
        ...state,
        mode: 'normal',
        visualStart: null,
        message: ''
      };

    case 'ENTER_SEARCH_MODE':
      return {
        ...state,
        mode: 'search',
        searchTerm: '',
        message: action.payload.direction === 'forward' ? '/' : '?'
      };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    case 'SET_SEARCH_MATCHES':
      return {
        ...state,
        searchMatches: action.payload.matches,
        currentMatchIndex: action.payload.currentIndex
      };

    case 'NEXT_MATCH':
      if (state.searchMatches.length === 0) return state;
      const nextIndex = (state.currentMatchIndex + 1) % state.searchMatches.length;
      return { ...state, currentMatchIndex: nextIndex };

    case 'PREV_MATCH':
      if (state.searchMatches.length === 0) return state;
      const prevIndex = state.currentMatchIndex - 1 < 0
        ? state.searchMatches.length - 1
        : state.currentMatchIndex - 1;
      return { ...state, currentMatchIndex: prevIndex };

    case 'SAVE_STATE_FOR_UNDO':
      // Save current state to undo stack
      return {
        ...state,
        undoStack: [...state.undoStack, {
          textLines: [...state.textLines],
          cursorPos: { ...state.cursorPos }
        }],
        redoStack: [] // Clear redo stack on new action
      };

    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const previousState = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        textLines: previousState.textLines,
        cursorPos: previousState.cursorPos,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, {
          textLines: [...state.textLines],
          cursorPos: { ...state.cursorPos }
        }],
        message: 'Undo'
      };

    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const nextState = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        textLines: nextState.textLines,
        cursorPos: nextState.cursorPos,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, {
          textLines: [...state.textLines],
          cursorPos: { ...state.cursorPos }
        }],
        message: 'Redo'
      };

    case 'SET_REGISTER':
      return {
        ...state,
        register: action.payload.content,
        registerType: action.payload.type
      };

    case 'SET_MARK':
      return {
        ...state,
        marks: {
          ...state.marks,
          [action.payload.mark]: action.payload.position
        }
      };

    case 'RESET':
      return {
        ...initialState,
        textLines: [...action.payload]
      };

    default:
      return state;
  }
}

export function useVimState(initialText) {
  const [state, dispatch] = useReducer(vimReducer, {
    ...initialState,
    textLines: [...initialText]
  });

  // Reset state when initialText changes (new lesson)
  useEffect(() => {
    dispatch({ type: 'RESET', payload: initialText });
  }, [initialText]);

  return [state, dispatch];
}
