function VimFooter({ message, hints, isCompleted, completionData, onNextLesson, onBackToLessons }) {
  return (
    <div className="vim-footer">
      <div className="vim-message">{message || '\u00A0'}</div>

      {isCompleted && completionData && (
        <div className="completion-panel">
          <div className="completion-stats">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{completionData.score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{completionData.timeTaken}s</span>
            </div>
            <div className="stat">
              <span className="stat-label">Mistakes:</span>
              <span className="stat-value">{completionData.mistakes}</span>
            </div>
          </div>
          <div className="completion-actions">
            <button className="btn-next" onClick={onNextLesson}>
              Next Lesson →
            </button>
            <button className="btn-back" onClick={onBackToLessons}>
              ← Back to Lessons
            </button>
          </div>
        </div>
      )}

      {!isCompleted && (
        <div className="vim-hints">
          <div className="hint-title">💡 Hints:</div>
          {hints.map((hint, idx) => (
            <div key={idx} className="hint">• {hint}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VimFooter;
