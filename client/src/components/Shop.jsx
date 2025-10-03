import { useState } from 'react';
import { useShopContext } from '../contexts/ShopContext';
import { shopItems, shopCategories } from '../data/shop';
import './Shop.css';

function Shop() {
  const { purchasedItems, currentPoints, handlePurchase, canAfford, hasPurchased } = useShopContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = shopItems.filter(item => {
    if (selectedCategory === 'all') return true;

    const categoryMap = {
      'themes': 'theme',
      'editor_styles': 'editor_style',
      'effects': ['badge_effect', 'completion_effect'],
      'sounds': 'sound_pack',
      'titles': 'title',
      'boosters': ['booster', 'consumable']
    };

    const allowedTypes = categoryMap[selectedCategory];
    if (Array.isArray(allowedTypes)) {
      return allowedTypes.includes(item.type);
    }
    return item.type === allowedTypes;
  });

  const handlePurchaseClick = (item) => {
    if (canAfford(item.cost) && !hasPurchased(item.id)) {
      handlePurchase(item.id, item);
      setSelectedItem(null);
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h2 className="shop-title">🛍️ Customization Shop</h2>
        <div className="points-display">
          <div className="points-section">
            <span className="points-label">Available Points:</span>
            <span className="points-value">{currentPoints}</span>
          </div>
        </div>
      </div>

      <div className="shop-categories">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </button>
        {shopCategories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      <div className="shop-items-grid">
        {filteredItems.map(item => {
          const purchased = hasPurchased(item.id);
          const affordable = canAfford(item.cost);

          return (
            <div
              key={item.id}
              className={`shop-item ${purchased ? 'purchased' : ''} ${!affordable && !purchased ? 'locked' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-footer">
                  <span className="item-cost">{item.cost} pts</span>
                  {purchased ? (
                    <span className="item-status owned">✓ Owned</span>
                  ) : affordable ? (
                    <span className="item-status available">Available</span>
                  ) : (
                    <span className="item-status locked">🔒 Locked</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="item-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
            <div className="modal-icon">{selectedItem.icon}</div>
            <h2 className="modal-title">{selectedItem.name}</h2>
            <p className="modal-description">{selectedItem.description}</p>

            {selectedItem.preview && (
              <div className="theme-preview">
                <h4>Theme Preview:</h4>
                <div className="preview-colors">
                  {Object.entries(selectedItem.preview).map(([key, color]) => (
                    <div key={key} className="preview-color">
                      <div className="color-box" style={{ backgroundColor: color }}></div>
                      <span className="color-label">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-footer">
              <div className="modal-cost">{selectedItem.cost} Points</div>
              {hasPurchased(selectedItem.id) ? (
                <button className="purchase-btn owned" disabled>Already Owned</button>
              ) : canAfford(selectedItem.cost) ? (
                <button
                  className="purchase-btn available"
                  onClick={() => handlePurchaseClick(selectedItem)}
                >
                  Purchase
                </button>
              ) : (
                <button className="purchase-btn locked" disabled>
                  Not Enough Points
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="no-items">
          <p>No items in this category yet!</p>
        </div>
      )}
    </div>
  );
}

export default Shop;
