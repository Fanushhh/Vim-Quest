import { useState } from 'react';
import { shopItems } from '../data/shop';
import './Profile.css';

function Profile({ username, purchasedItems, activeCustomizations, onCustomizationChange, onAddPoints, devMode, onToggleDevMode }) {
  const [activeTab, setActiveTab] = useState('theme');

  const getPurchasedItemsByType = (type) => {
    return shopItems.filter(item =>
      purchasedItems.includes(item.id) &&
      (Array.isArray(type) ? type.includes(item.type) : item.type === type)
    );
  };

  const themes = getPurchasedItemsByType('theme');
  const editorStyles = getPurchasedItemsByType('editor_style');
  const badgeEffects = getPurchasedItemsByType('badge_effect');
  const completionEffects = getPurchasedItemsByType('completion_effect');
  const soundPacks = getPurchasedItemsByType('sound_pack');
  const titles = getPurchasedItemsByType('title');

  const isActive = (itemId, type) => {
    return activeCustomizations[type] === itemId;
  };

  const handleSelect = (itemId, type) => {
    onCustomizationChange(type, itemId);
  };

  const renderCustomizationSection = (title, items, type, icon) => (
    <div className="customization-section">
      <h3 className="section-title">{icon} {title}</h3>
      {items.length === 0 ? (
        <div className="no-items-message">
          <p>No {title.toLowerCase()} purchased yet. Visit the shop to unlock customizations!</p>
        </div>
      ) : (
        <div className="customization-grid">
          {type === 'theme' && (
            <div
              className={`customization-item ${!activeCustomizations.theme ? 'active' : ''}`}
              onClick={() => handleSelect(null, 'theme')}
            >
              <div className="item-icon">🌑</div>
              <div className="item-name">Default Theme</div>
              {!activeCustomizations.theme && <div className="active-badge">✓ Active</div>}
            </div>
          )}
          {items.map(item => (
            <div
              key={item.id}
              className={`customization-item ${isActive(item.id, type) ? 'active' : ''}`}
              onClick={() => handleSelect(item.id, type)}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-name">{item.name}</div>
              {item.preview && (
                <div className="mini-preview">
                  {Object.values(item.preview).slice(0, 3).map((color, idx) => (
                    <div key={idx} className="mini-color" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
              )}
              {isActive(item.id, type) && <div className="active-badge">✓ Active</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <span className="avatar-emoji">👤</span>
          </div>
          <div className="profile-details">
            <h2 className="profile-username">{username}</h2>
            {activeCustomizations.title && (
              <p className="profile-title">
                {shopItems.find(i => i.id === activeCustomizations.title)?.title}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          🎨 Themes
        </button>
        <button
          className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          💻 Editor
        </button>
        <button
          className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
          onClick={() => setActiveTab('effects')}
        >
          ✨ Effects
        </button>
        <button
          className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          🎵 Audio
        </button>
        <button
          className={`tab-btn ${activeTab === 'display' ? 'active' : ''}`}
          onClick={() => setActiveTab('display')}
        >
          🏷️ Display
        </button>
        <button
          className={`tab-btn ${activeTab === 'dev' ? 'active' : ''}`}
          onClick={() => setActiveTab('dev')}
        >
          🛠️ Dev Mode
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'theme' && renderCustomizationSection(
          'Dashboard Themes',
          themes,
          'theme',
          '🎨'
        )}

        {activeTab === 'editor' && renderCustomizationSection(
          'Editor Styles',
          editorStyles,
          'editor_style',
          '💻'
        )}

        {activeTab === 'effects' && (
          <>
            {renderCustomizationSection(
              'Badge Effects',
              badgeEffects,
              'badge_effect',
              '✨'
            )}
            {renderCustomizationSection(
              'Completion Effects',
              completionEffects,
              'completion_effect',
              '🎉'
            )}
          </>
        )}

        {activeTab === 'audio' && renderCustomizationSection(
          'Sound Packs',
          soundPacks,
          'sound_pack',
          '🎵'
        )}

        {activeTab === 'display' && renderCustomizationSection(
          'Custom Titles',
          titles,
          'title',
          '🏷️'
        )}

        {activeTab === 'dev' && (
          <div className="customization-section">
            <h3 className="section-title">🛠️ Developer Mode</h3>
            <div className="dev-mode-content">
              <div className="dev-mode-info">
                <p className="dev-info-text">
                  Developer mode allows you to test shop features without earning points.
                  Toggle infinite points or manually add points for testing.
                </p>
              </div>

              <div className="dev-mode-controls">
                <div className="dev-control-card">
                  <div className="control-header">
                    <h4>♾️ Infinite Points Mode</h4>
                    <p className="control-description">
                      When enabled, you'll have unlimited points to purchase anything
                    </p>
                  </div>
                  <button
                    className={`dev-toggle-btn ${devMode ? 'active' : ''}`}
                    onClick={onToggleDevMode}
                  >
                    {devMode ? '✓ Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="dev-control-card">
                  <div className="control-header">
                    <h4>💰 Add Test Points</h4>
                    <p className="control-description">
                      Manually add points to your account for testing
                    </p>
                  </div>
                  <div className="point-buttons">
                    <button
                      className="add-points-btn small"
                      onClick={() => onAddPoints(100)}
                    >
                      +100
                    </button>
                    <button
                      className="add-points-btn medium"
                      onClick={() => onAddPoints(500)}
                    >
                      +500
                    </button>
                    <button
                      className="add-points-btn large"
                      onClick={() => onAddPoints(1000)}
                    >
                      +1000
                    </button>
                    <button
                      className="add-points-btn mega"
                      onClick={() => onAddPoints(5000)}
                    >
                      +5000
                    </button>
                  </div>
                </div>

                <div className="dev-control-card warning">
                  <div className="control-header">
                    <h4>⚠️ Testing Tools</h4>
                    <p className="control-description">
                      These tools are for development and testing purposes only
                    </p>
                  </div>
                  <div className="warning-note">
                    <p>
                      💡 <strong>Tip:</strong> Use infinite points mode to quickly test all shop items,
                      or add specific point amounts to test the purchasing flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
