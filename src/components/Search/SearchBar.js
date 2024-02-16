import React, { useState } from "react";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, toggleFilters, 
                    showFilters, showSortButtons, handleSortNewestFirst, handleSortOldestFirst, 
                    handleResetSorting }) => {

  const [sortBy, setSortBy] = useState("");
  // State to toggle visibility of sort options
  const [showSortOptions, setShowSortOptions] = useState(false); 

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
    <form onSubmit={handleSearch} 
          style={{ 
                  marginBottom: '20px', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
      <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '10px' 
                  }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for an animal type"
          style={{ 
                  marginRight: '10px', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  border: '1px solid #ccc', 
                  flex: 1 
                }}
        />
        <button type="submit" 
                style={{ 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: 'none', 
                        background: '#007bff', 
                        color: '#fff', 
                        cursor: 'pointer' 
                      }}>Search</button>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <button style={{ 
                        marginRight: '10px', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: 'none', 
                        background: 'none', 
                        color: '#007bff', 
                        cursor: 'pointer'
                      }} 
                onClick={toggleFilters}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <button style={{ 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: 'none', 
                        background: 'none', 
                        color: '#007bff', 
                        cursor: 'pointer'  
                      }} 
                onClick={() => setShowSortOptions(!showSortOptions)}>
          {showSortOptions ? "Hide Sort Options" : "Show Sort Options"}
        </button>
      </div>
      {showSortOptions && showSortButtons && (
        <>
          <span style={{ marginBottom: '10px', fontWeight: 'bold' }}>Sort by:</span>
          <button
            style={{ 
                    marginBottom: '10px', 
                    marginRight: '5px', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    background: sortBy === "newest" ? '#007bff' : '#fff', 
                    color: sortBy === "newest" ? '#fff' : '#007bff', 
                    cursor: 'pointer' 
            }}
            onClick={() => {
              handleSortOptionClick("newest");
              // Sort animals by newest first
              handleSortNewestFirst(); 
            }}
          >
            Newest First
          </button>
          <button
            style={{ 
                    marginBottom: '10px', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    background: sortBy === "oldest" ? '#007bff' : '#fff', 
                    color: sortBy === "oldest" ? '#fff' : '#007bff', 
                    cursor: 'pointer' 
                  }}
            onClick={() => {
              handleSortOptionClick("oldest");
              // Sort animals by oldest first
              handleSortOldestFirst(); 
            }}
          >
            Oldest First
          </button>
          <button
            style={{ 
                    marginBottom: '10px', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    background: sortBy === "" ? '#007bff' : '#fff', 
                    color: sortBy === "" ? '#fff' : '#007bff', 
                    cursor: 'pointer' 
                  }}
            onClick={() => {
              handleSortOptionClick("");
              // Reset sorting order to default
              handleResetSorting(); 
            }}
          >
            Default
          </button>
        </>
      )}
    </form>
  );
};

export default SearchBar;