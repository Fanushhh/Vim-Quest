# VIM Quest Architecture

## Project Structure

The codebase has been refactored for better maintainability and separation of concerns.

### Component Architecture

```
client/src/
├── components/
│   ├── VimSimulatorRefactored.jsx  # Main orchestrator component
│   ├── VimEditor.jsx                # Renders the text editor view
│   ├── VimHeader.jsx                # Shows mode and stats
│   ├── VimFooter.jsx                # Shows messages and hints
│   ├── Dashboard.jsx                # Main app dashboard
│   ├── LessonList.jsx               # Lesson selection UI
│   ├── Achievements.jsx             # Achievement display
│   └── Auth.jsx                     # Authentication forms
│
├── hooks/
│   └── useVimState.js               # State management with useReducer
│
├── utils/
│   └── vimCommands.js               # Pure functions for Vim operations
│
└── data/
    └── lessons.js                   # Lesson content and configuration
```

## State Management

### useVimState Hook

Uses React's `useReducer` for predictable state updates:

**State Shape:**
```javascript
{
  cursorPos: { row: number, col: number },
  mode: 'normal' | 'insert' | 'visual',
  textLines: string[],
  message: string,
  mistakes: number,
  pendingCommand: string,
  visualStart: { row: number, col: number } | null,
  commandHistory: string[]
}
```

**Actions:**
- `INIT_TEXT` - Initialize text lines
- `SET_CURSOR` - Update cursor position
- `SET_MODE` - Change Vim mode
- `SET_MESSAGE` - Update status message
- `INCREMENT_MISTAKES` - Track errors
- `SET_PENDING_COMMAND` - For multi-char commands (dd, dw, gg)
- `SET_VISUAL_START` - Track visual selection start
- `ENTER_INSERT_MODE` - Enter insert mode with message
- `ENTER_VISUAL_MODE` - Enter visual mode with selection
- `EXIT_TO_NORMAL` - Return to normal mode

## Utility Functions

### vimCommands.js

Pure functions that handle Vim operations without side effects:

#### `moveCursor(cursorPos, textLines, command)`
Calculates new cursor position for movement commands (h, j, k, l, w, b, e, 0, $, ^, gg, G).

#### `deleteText(textLines, cursorPos, command, visualStart, mode)`
Handles all deletion operations (x, dd, dw, d$, visual delete). Returns new text lines, cursor position, and status message.

#### `insertText(textLines, cursorPos, char)`
Inserts a character at the cursor position.

#### `checkTaskCompletion(lesson, textLines, cursorPos, startTime, mistakes)`
Checks if the current state matches lesson completion criteria.

## Component Responsibilities

### VimSimulatorRefactored
- **Role**: Main orchestrator
- **Responsibilities**:
  - Manages overall state using useVimState hook
  - Handles keyboard events
  - Coordinates between pure functions and state updates
  - Manages lesson completion logic
  - Provides context to child components

### VimEditor
- **Role**: Presentation component
- **Responsibilities**:
  - Renders text lines with line numbers
  - Highlights cursor position
  - Shows visual mode selections
  - Displays target positions
  - Pure component with no business logic

### VimHeader
- **Role**: Status display
- **Responsibilities**:
  - Shows current mode
  - Displays mistake count
  - Shows cursor position

### VimFooter
- **Role**: Feedback and guidance
- **Responsibilities**:
  - Displays status messages
  - Shows lesson hints
  - Maintains consistent height (no layout shifts)

## Data Flow

```
User Keyboard Input
       ↓
VimSimulatorRefactored (handleKeyPress)
       ↓
Command Validation (allowedCommands check)
       ↓
Pure Function (moveCursor/deleteText/insertText)
       ↓
State Update (dispatch action)
       ↓
Re-render (VimEditor, VimHeader, VimFooter)
       ↓
Completion Check (checkTaskCompletion)
```

## Benefits of Refactored Architecture

### 1. **Separation of Concerns**
- UI components only handle presentation
- Business logic isolated in utility functions
- State management centralized in reducer

### 2. **Testability**
- Pure functions easy to unit test
- No side effects in vimCommands.js
- Predictable state transitions

### 3. **Maintainability**
- Each file has single responsibility
- Easy to locate and fix bugs
- Simple to add new Vim commands

### 4. **Readability**
- Components are small and focused
- Clear data flow
- Self-documenting code structure

### 5. **Reusability**
- Utility functions can be used in other contexts
- Components can be composed differently
- State hook can be reused

## Adding New Features

### Adding a New Vim Command

1. **Add to vimCommands.js**
   ```javascript
   // In moveCursor() or deleteText()
   case 'newCommand':
     // implementation
     break;
   ```

2. **Add to keyboard handler**
   ```javascript
   // In VimSimulatorRefactored.jsx
   const keyMap = {
     // ...
     'x': 'newCommand'
   };
   ```

3. **Add to lesson allowedCommands**
   ```javascript
   // In lessons.js
   allowedCommands: [..., 'newCommand']
   ```

### Adding a New Lesson Type

1. **Update checkTaskCompletion()** in vimCommands.js
2. **Add task type** to lesson data
3. **Add completion logic** for new task type

## Performance Considerations

- **Memoization**: Consider React.memo for VimEditor if rendering becomes slow
- **State Updates**: Reducer ensures minimal re-renders
- **Pure Functions**: No unnecessary computations
- **Event Listeners**: Properly cleaned up in useEffect

## Future Improvements

- [ ] Add Context API for global app state
- [ ] Implement undo/redo with reducer history
- [ ] Add command recording/playback
- [ ] Optimize large text file handling
- [ ] Add WebSocket for multiplayer mode
- [ ] Implement macro recording
