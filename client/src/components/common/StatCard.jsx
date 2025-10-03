import React from 'react';
import './StatCard.css';

export function StatCard({ icon, label, value, color = '#00ff00' }) {
  return (
    <div className="stat-card">
      {icon && <span className="stat-icon" style={{ color }}>{icon}</span>}
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}
