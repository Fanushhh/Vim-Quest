function VimHeader({ mode, mistakes, cursorPos, lessonNumber }) {
  return (
    <div className="vim-header">
      <div className="vim-mode">Mode: {mode.toUpperCase()}</div>
      <div className="vim-stats">
        {lessonNumber && <span className="lesson-indicator">Lesson {lessonNumber}</span>}
        <span>Mistakes: {mistakes}</span>
        <span>Position: {cursorPos.row}:{cursorPos.col}</span>
      </div>
    </div>
  );
}

export default VimHeader;
