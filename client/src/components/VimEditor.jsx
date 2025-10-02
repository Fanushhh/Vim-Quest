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

              return (
                <span
                  key={colIdx}
                  className={`char ${isCursor ? 'cursor' : ''} ${isTarget ? 'target' : ''} ${isSelected ? 'selected' : ''}`}
                  style={isCursor && cursorColor ? { background: cursorColor } : undefined}
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
