import React from 'react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>{message}</p>
    </div>
  );
}
