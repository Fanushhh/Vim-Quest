import './LessonList.css';

function LessonList({ lessons, progress, onStartLesson }) {
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

  const groupedLessons = {
    beginner: lessons.filter(l => l.difficulty === 'beginner'),
    intermediate: lessons.filter(l => l.difficulty === 'intermediate'),
    advanced: lessons.filter(l => l.difficulty === 'advanced')
  };

  return (
    <div className="lesson-list">
      <h2 className="lesson-list-title">📚 Vim Lessons</h2>

      {Object.entries(groupedLessons).map(([difficulty, lessonGroup]) => (
        <div key={difficulty} className="lesson-group">
          <h3 className={`difficulty-title ${difficulty}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
          </h3>

          <div className="lessons">
            {lessonGroup.map((lesson) => {
              const completed = isCompleted(lesson.id);
              const score = getScore(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`lesson-card ${completed ? 'completed' : ''}`}
                >
                  <div className="lesson-header">
                    <div className="lesson-number">#{lesson.id}</div>
                    {completed && <div className="completion-badge">✓</div>}
                  </div>

                  <h4 className="lesson-title">{lesson.title}</h4>
                  <p className="lesson-desc">{lesson.description}</p>

                  <div className="lesson-footer">
                    <div className="lesson-score">
                      {completed ? (
                        <>Score: <strong>{score}</strong>/100</>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </div>
                    <button
                      className="start-button"
                      onClick={() => onStartLesson(lesson)}
                    >
                      {completed ? 'Retry' : 'Start'} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LessonList;
