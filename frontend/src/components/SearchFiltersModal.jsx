import '../styles/SearchFiltersModal.css';

export default function SearchFiltersModal({ 
  isOpen, 
  onClose,
  searchQuery,
  setSearchQuery,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  resetFilters
}) {
  const handleApply = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2>🔍 Фильтры поиска</h2>

            <div className="filter-group">
              <label>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                Поиск
              </label>
              <input
                type="text"
                placeholder="Город или название отеля..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>💰 Мин. цена</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>💰 Макс. цена</label>
                <input
                  type="number"
                  placeholder="$500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>⭐ Мин. рейтинг</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">Любой</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐⭐⭐⭐</option>
                <option value="4.5">4.5+ ⭐⭐⭐⭐⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>📊 Сортировать по</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Рейтингу ⭐</option>
                <option value="price-low">Цене (возрастание) 💰</option>
                <option value="price-high">Цене (убывание) 💰💰</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-reset" onClick={resetFilters}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                Сбросить
              </button>
              <button className="btn-apply" onClick={handleApply}>
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}