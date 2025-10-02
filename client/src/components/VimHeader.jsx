function VimHeader({ mode, mistakes, cursorPos }) {
  return (
    <div className="vim-header">
      <div className="vim-mode">Mode: {mode.toUpperCase()}</div>
      <div className="vim-stats">
        <span>Mistakes: {mistakes}</span>
        <span>Position: {cursorPos.row}:{cursorPos.col}</span>
      </div>
    </div>
  );
}

export default VimHeader;
