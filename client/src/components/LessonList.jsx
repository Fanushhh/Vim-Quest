import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LessonList.css';

function LessonList({ lessons, progress, onStartLesson }) {
  const [expandedCategories, setExpandedCategories] = useState({
    beginner: true,
    intermediate: false,
    advanced: false,
    developer: false
  });

  const getLessonProgress = (lessonId) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const isCompleted = (lessonId) => {
    const lessonProgress = getLessonProgress(lessonId);
    return lessonProgress?.completed === 1;
  };

  const getScore = (lessonId) => {
    const lessonProgress = getLessonProgress(lessonId);
    return lessonProgress?.score || 0;
  };

  const toggleCategory = (difficulty) => {
    setExpandedCategories(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };

  const groupedLessons = {
    beginner: lessons.filter(l => l.difficulty === 'beginner'),
    intermediate: lessons.filter(l => l.difficulty === 'intermediate'),
    advanced: lessons.filter(l => l.difficulty === 'advanced'),
    developer: lessons.filter(l => l.difficulty === 'developer')
  };

  const getCategoryIcon = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '⚡';
      case 'advanced': return '🏆';
      case 'developer': return '💻';
      default: return '📚';
    }
  };

  const getCategoryStats = (lessonGroup) => {
    const total = lessonGroup.length;
    const completed = lessonGroup.filter(l => isCompleted(l.id)).length;
    return { total, completed };
  };

  return (
    <div className="lesson-list">
      <h2 className="lesson-list-title">📚 Vim Lessons</h2>

      {Object.entries(groupedLessons).map(([difficulty, lessonGroup]) => {
        const stats = getCategoryStats(lessonGroup);
        const isExpanded = expandedCategories[difficulty];

        return (
          <div key={difficulty} className="lesson-category">
            <button
              className={`category-header ${difficulty} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleCategory(difficulty)}
            >
              <div className="category-info">
                <span className="category-icon">{getCategoryIcon(difficulty)}</span>
                <span className="category-name">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                <span className="category-stats">
                  {stats.completed}/{stats.total} completed
                </span>
              </div>
              <span className="category-arrow">{isExpanded ? '▼' : '▶'}</span>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  className="category-lessons"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="category-lessons-inner">
                    {lessonGroup.map((lesson, index) => {
                      const completed = isCompleted(lesson.id);
                      const score = getScore(lesson.id);

                      return (
                        <motion.div
                          key={lesson.id}
                          className={`lesson-row ${completed ? 'completed' : ''}`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="lesson-main">
                            <div className="lesson-info">
                              <div className="lesson-number-badge">#{lesson.id}</div>
                              <div className="lesson-details">
                                <h4 className="lesson-title">{lesson.title}</h4>
                                <p className="lesson-desc">{lesson.description}</p>
                              </div>
                            </div>

                            <div className="lesson-actions">
                              {completed && (
                                <div className="lesson-score">
                                  <span className="score-label">Score:</span>
                                  <span className="score-value">{score}/100</span>
                                </div>
                              )}
                              <button
                                className="start-button"
                                onClick={() => onStartLesson(lesson)}
                              >
                                {completed ? '✓ Retry' : 'Start'} →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default LessonList;
