import { useState } from 'react';
import './DebugPanel.css';

function DebugPanel({ state, commandHistory, errors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('state');

  if (!isOpen) {
    return (
      <button className="debug-toggle" onClick={() => setIsOpen(true)}>
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>Debug Panel</h3>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="debug-tabs">
        <button
          className={activeTab === 'state' ? 'active' : ''}
          onClick={() => setActiveTab('state')}
        >
          State
        </button>
        <button
          className={activeTab === 'commands' ? 'active' : ''}
          onClick={() => setActiveTab('commands')}
        >
          Commands
        </button>
        <button
          className={activeTab === 'errors' ? 'active' : ''}
          onClick={() => setActiveTab('errors')}
        >
          Errors {errors?.length > 0 && `(${errors.length})`}
        </button>
      </div>

      <div className="debug-content">
        {activeTab === 'state' && (
          <div className="debug-section">
            <h4>Current State</h4>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        )}

        {activeTab === 'commands' && (
          <div className="debug-section">
            <h4>Command History</h4>
            {commandHistory && commandHistory.length > 0 ? (
              <ul>
                {commandHistory.map((cmd, idx) => (
                  <li key={idx}>
                    <span className="cmd-index">{idx + 1}.</span>
                    <span className="cmd-name">{cmd}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No commands executed yet</p>
            )}
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="debug-section">
            <h4>Errors & Warnings</h4>
            {errors && errors.length > 0 ? (
              <ul>
                {errors.map((error, idx) => (
                  <li key={idx} className="error-item">
                    <span className="error-time">{error.timestamp}</span>
                    <span className="error-message">{error.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-errors">No errors recorded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DebugPanel;
