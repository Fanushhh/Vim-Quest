import { shopItems } from '../data/shop';

function VimEditor({ textLines, cursorPos, mode, visualStart, lesson, editorStyle }) {
  const getEditorStyles = () => {
    if (!editorStyle) return {};

    const style = shopItems.find(item => item.id === editorStyle);
    if (!style || !style.style) return {};

    return {
      fontFamily: style.style.fontFamily || undefined,
      color: style.style.textColor || undefined,
      backgroundColor: style.style.backgroundColor || undefined,
    };
  };

  const getCursorColor = () => {
    if (!editorStyle) return undefined;
    const style = shopItems.find(item => item.id === editorStyle);
    return style?.style?.cursorColor || undefined;
  };

  const hasScanlines = () => {
    if (!editorStyle) return false;
    const style = shopItems.find(item => item.id === editorStyle);
    return style?.style?.scanlines || false;
  };

  const getSyntaxHighlighting = () => {
    if (!editorStyle) return null;
    const style = shopItems.find(item => item.id === editorStyle);
    if (style?.style?.colorScheme === 'rainbow') {
      return {
        colors: style.style.bracketColors || ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8'],
        enabled: true
      };
    }
    return null;
  };

  const highlightSyntax = (char, colIdx, line) => {
    const syntaxConfig = getSyntaxHighlighting();
    if (!syntaxConfig || !syntaxConfig.enabled) return {};

    // Keywords to highlight
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'new', 'this', 'import', 'export', 'from', 'async', 'await'];
    const word = getWordAtPosition(line, colIdx);

    if (keywords.includes(word)) {
      return { color: '#569cd6' }; // Blue for keywords
    }

    // Strings
    if (char === '"' || char === "'" || char === '`') {
      return { color: '#ce9178' }; // Orange for strings
    }

    // Numbers
    if (/\d/.test(char)) {
      return { color: '#b5cea8' }; // Green for numbers
    }

    // Brackets with rainbow colors
    const brackets = ['(', ')', '[', ']', '{', '}'];
    if (brackets.includes(char)) {
      const depth = getBracketDepth(line, colIdx);
      const colorIndex = depth % syntaxConfig.colors.length;
      return { color: syntaxConfig.colors[colorIndex] };
    }

    // Comments
    if (char === '/' && colIdx < line.length - 1 && line[colIdx + 1] === '/') {
      return { color: '#6a9955' }; // Green for comments
    }

    return {};
  };

  const getWordAtPosition = (line, colIdx) => {
    let start = colIdx;
    let end = colIdx;

    // Find word boundaries
    while (start > 0 && /[a-zA-Z]/.test(line[start - 1])) start--;
    while (end < line.length && /[a-zA-Z]/.test(line[end])) end++;

    return line.slice(start, end);
  };

  const getBracketDepth = (line, colIdx) => {
    let depth = 0;
    const openBrackets = ['(', '[', '{'];
    const closeBrackets = [')', ']', '}'];

    for (let i = 0; i < colIdx; i++) {
      if (openBrackets.includes(line[i])) depth++;
      if (closeBrackets.includes(line[i])) depth--;
    }

    return Math.max(0, depth);
  };

  const cursorColor = getCursorColor();
  const scanlines = hasScanlines();

  return (
    <div className={`vim-editor ${scanlines ? 'scanlines' : ''}`} style={getEditorStyles()}>
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
              const isVisualCharSelected = mode === 'visual' && visualStart &&
                visualStart.row === rowIdx && cursorPos.row === rowIdx &&
                colIdx >= Math.min(visualStart.col, cursorPos.col) &&
                colIdx <= Math.max(visualStart.col, cursorPos.col);

              // Check if in visual line selection
              const isVisualLineSelected = mode === 'visual-line' && visualStart &&
                rowIdx >= Math.min(visualStart.row, cursorPos.row) &&
                rowIdx <= Math.max(visualStart.row, cursorPos.row);

              const isSelected = isVisualCharSelected || isVisualLineSelected;

              const syntaxStyle = highlightSyntax(char, colIdx, line);
              const charStyle = isCursor && cursorColor
                ? { background: cursorColor, ...syntaxStyle }
                : syntaxStyle;

              return (
                <span
                  key={colIdx}
                  className={`char ${isCursor ? 'cursor' : ''} ${isTarget ? 'target' : ''} ${isSelected ? 'selected' : ''}`}
                  style={charStyle}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default VimEditor;
