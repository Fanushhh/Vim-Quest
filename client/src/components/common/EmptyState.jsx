import React from 'react';

export function EmptyState({ message = 'No data available', icon }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
      {icon && <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>}
      <p>{message}</p>
    </div>
  );
}
