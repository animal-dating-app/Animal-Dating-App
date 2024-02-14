import React, { useState } from "react";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, toggleFilters, showFilters, showSortButtons, handleSortNewestFirst, handleSortOldestFirst, handleResetSorting }) => {
  const [sortBy, setSortBy] = useState("");

  const handleSortOptionClick = (option) => {
    if (sortBy !== option) {
      setSortBy(option);
    } else {
      // Deselect the button if it's already selected
      setSortBy("");
      // Reset the sorting order
      handleResetSorting();
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for an animal type"
          style={{ 
            width: '300px' 
        }}
          
        />
        <button type="submit">Search</button>
        <button
          style={{ marginLeft: '30px', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={toggleFilters}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        {showSortButtons && (
          <>
            <span style={{ 
                    marginRight: '10px', 
                    marginLeft: '30px'
                      }}>Sort by:</span>
            <button
              style = {{
                marginRight: '5px'
              }}
              onClick={() => {
                handleSortOptionClick("newest");
                handleSortNewestFirst(); // Sort animals by newest first
              }}
              className={"btn" + (sortBy === "newest" ? " btn-primary" : " btn-secondary") + " ml-2 mr-2"}
            >
              Newest First
            </button>
            <button
              onClick={() => {
                handleSortOptionClick("oldest");
                handleSortOldestFirst(); // Sort animals by oldest first
              }}
              className={"btn" + (sortBy === "oldest" ? " btn-primary" : " btn-secondary") + " mr-2"}
            >
              Oldest First
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default SearchBar;