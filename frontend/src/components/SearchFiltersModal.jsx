import { useState } from 'react';
import '../styles/SearchFiltersModal.css';

export default function SearchFiltersModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 500,
    minRating: 'any',
    sortBy: 'rating'
  });

  const handleApply = () => {
    console.log('Applied filters:', filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      minPrice: 0,
      maxPrice: 500,
      minRating: 'any',
      sortBy: 'rating'
    });
  };

  return (
    <>
      <button className="filters-toggle" onClick={() => setIsOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>Фильтры</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2>Фильтры поиска</h2>

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
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>
                  <span>💰</span> Мин. цена
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>
                  <span>💰</span> Макс. цена
                </label>
                <input
                  type="number"
                  placeholder="$500"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>
                <span>⭐</span> Мин. рейтинг
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
              >
                <option value="any">Любой</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐⭐⭐⭐</option>
                <option value="4.5">4.5+ ⭐⭐⭐⭐⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>
                <span>📊</span> Сортировать по
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="rating">Рейтингу</option>
                <option value="price-asc">Цене (возрастание)</option>
                <option value="price-desc">Цене (убывание)</option>
                <option value="name">Названию</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-reset" onClick={handleReset}>
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