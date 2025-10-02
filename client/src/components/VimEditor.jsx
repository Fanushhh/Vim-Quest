function VimEditor({ textLines, cursorPos, mode, visualStart, lesson }) {
  return (
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
  );
}

export default VimEditor;
