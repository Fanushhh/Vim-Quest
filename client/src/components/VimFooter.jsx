import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function VimFooter({ message, hints, isCompleted, completionData, onNextLesson, onBackToLessons }) {
  const [expandedHints, setExpandedHints] = useState({});

  const toggleHint = (idx) => {
    setExpandedHints(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

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
          <div className="hint-title">💡 Hints</div>
          {hints.map((hint, idx) => (
            <div key={idx} className="hint-item">
              <button
                className={`hint-toggle ${expandedHints[idx] ? 'expanded' : ''}`}
                onClick={() => toggleHint(idx)}
              >
                <span className="hint-number">Hint {idx + 1}</span>
                <span className="hint-arrow">{expandedHints[idx] ? '▼' : '▶'}</span>
              </button>
              <AnimatePresence initial={false}>
                {expandedHints[idx] && (
                  <motion.div
                    className="hint-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="hint-content-inner">{hint}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VimFooter;
