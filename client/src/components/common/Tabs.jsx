import React from 'react';
import './Tabs.css';

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`tabs-container ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${activeTab === tab.value ? 'active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
