function EventFilters({
  search,
  category,
  city,
  sort,
  minPrice,
  maxPrice,
  priceRangeError,
  categories,
  cities,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onCityChange,
  onSortChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}) {
  return (
    <form
      className="browse-filters"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="browse-filter-field browse-search-field">
        <label htmlFor="event-search">Search events</label>
        <input
          id="event-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Try a title, venue, city, or category"
        />
      </div>
      <div className="browse-filter-field">
        <label htmlFor="event-category">Category</label>
        <select
          id="event-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((eventCategory) => (
            <option key={eventCategory} value={eventCategory}>
              {eventCategory}
            </option>
          ))}
        </select>
      </div>
      <div className="browse-filter-field">
        <label htmlFor="event-city">City</label>
        <select
          id="event-city"
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((eventCity) => (
            <option key={eventCity} value={eventCity}>
              {eventCity}
            </option>
          ))}
        </select>
      </div>
      <div className="browse-filter-field">
        <label htmlFor="event-sort">Sort by</label>
        <select
          id="event-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="date-asc">Soonest first</option>
          <option value="date-desc">Latest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <fieldset
        className="browse-price-range"
        aria-describedby={priceRangeError ? 'price-range-error' : 'price-range-help'}
      >
        <legend>Starting price (Rs)</legend>
        <div className="browse-price-inputs">
          <div className="browse-price-input">
            <label htmlFor="event-min-price">Minimum</label>
            <input
              id="event-min-price"
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={minPrice}
              aria-invalid={Boolean(priceRangeError)}
              aria-describedby={priceRangeError ? 'price-range-error' : 'price-range-help'}
              onChange={(event) => onMinPriceChange(event.target.value)}
            />
          </div>
          <div className="browse-price-input">
            <label htmlFor="event-max-price">Maximum</label>
            <input
              id="event-max-price"
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={maxPrice}
              aria-invalid={Boolean(priceRangeError)}
              aria-describedby={priceRangeError ? 'price-range-error' : 'price-range-help'}
              onChange={(event) => onMaxPriceChange(event.target.value)}
            />
          </div>
        </div>
        <span className="visually-hidden" id="price-range-help">
          Filter by event starting ticket price. Bounds are inclusive.
        </span>
      </fieldset>
      <button
        className="browse-reset-button"
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilters}
      >
        Reset
      </button>
      {priceRangeError && (
        <p className="browse-price-error" id="price-range-error" role="alert">
          {priceRangeError}
        </p>
      )}
    </form>
  )
}

export default EventFilters
