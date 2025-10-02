import './Achievements.css';

function Achievements({ achievements, achievementList, badgeEffect }) {
  const isUnlocked = (type) => {
    return achievements.some(a => a.achievement_type === type);
  };

  const getUnlockedDate = (type) => {
    const achievement = achievements.find(a => a.achievement_type === type);
    return achievement ? new Date(achievement.unlocked_at).toLocaleDateString() : null;
  };

  return (
    <div className="achievements-container">
      <h2 className="achievements-title">🏆 Your Achievements</h2>
      <p className="achievements-subtitle">
        Unlocked {achievements.length} of {achievementList.length} achievements
      </p>

      <div className="achievements-grid">
        {achievementList.map((achievement) => {
          const unlocked = isUnlocked(achievement.type);
          const date = getUnlockedDate(achievement.type);

          return (
            <div
              key={achievement.type}
              className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className={`achievement-icon ${unlocked && badgeEffect ? badgeEffect : ''}`}>{achievement.icon}</div>
              <div className="achievement-content">
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <p className="achievement-points">{achievement.points} points</p>
                {unlocked && date && (
                  <p className="achievement-date">Unlocked: {date}</p>
                )}
                {!unlocked && <p className="achievement-locked">🔒 Locked</p>}
              </div>
            </div>
          );
        })}
      </div>

      {achievements.length === 0 && (
        <div className="no-achievements">
          <p>Complete lessons to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}

export default Achievements;
