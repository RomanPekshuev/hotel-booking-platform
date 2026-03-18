import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHotels } from '../api/hotels';
import SearchFiltersModal from './SearchFiltersModal';
import '../styles/hotellist.css';

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [hotels, searchQuery, minPrice, maxPrice, minRating, sortBy]);

  async function loadHotels() {
    try {
      setLoading(true);
      const data = await getHotels();
      setHotels(data);
      setFilteredHotels(data);
      setError('');
    } catch (err) {
      setError('Failed to load hotels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function filterAndSortHotels() {
    let result = [...hotels];

    if (searchQuery) {
      result = result.filter(hotel =>
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (minPrice) {
      result = result.filter(hotel => hotel.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(hotel => hotel.price <= Number(maxPrice));
    }

    if (minRating) {
      result = result.filter(hotel => hotel.rating >= Number(minRating));
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - b.price);
    }

    setFilteredHotels(result);
  }

  function resetFilters() {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('rating');
  }

  if (loading) {
    return <div className="loading">Loading hotels...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="hotel-list">
      <h1>Available Hotels</h1>
      
      <div className="filters-bar">
        <button className="btn-filters" onClick={() => setIsModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span>Фильтры</span>
          {(searchQuery || minPrice || maxPrice || minRating) && (
            <span className="filter-badge">●</span>
          )}
        </button>
        
        <span className="results-count">
          Found {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
        </span>
      </div>

      <SearchFiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        resetFilters={resetFilters}
      />
      
      <div className="hotels-grid">
        {filteredHotels.map(hotel => (
          <div key={hotel.id} className="hotel-card">
            {hotel.image && (
              <img src={hotel.image} alt={hotel.name} />
            )}
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p className="location">📍 {hotel.location}</p>
              <p className="rating">⭐ {hotel.rating}/5</p>
              <p className="price">💰 ${hotel.price}/night</p>
              <p className="description">{hotel.description}</p>
              <Link to={`/hotels/${hotel.id}`} className="btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="no-results">
          <p>😔 No hotels found matching your criteria</p>
          <button className="btn-reset" onClick={resetFilters}>
            🔄 Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}