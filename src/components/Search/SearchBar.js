import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, toggleFilters, showFilters }) => {
  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for an animal type"
        />
        <button type="submit">Search</button>
        <button
          style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={toggleFilters}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;