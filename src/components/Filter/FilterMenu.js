import React from "react";

const FilterMenu = ({ selectedFilters, handleFilterChange, animals }) => {

  // Function to get unique values for a filter category
  function getUniqueValuesForCategory(animals, category) {
    const values = new Set();
    animals.forEach(animal => {
        values.add(animal[category]);
    });

    // Sort the age category
    const sortedValues = Array.from(values).sort((a, b) => a - b);
    return sortedValues;
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {Object.keys(selectedFilters).map(category => (
        category !== 'type' && (
          <div key={category}>
            <br />
            <h3>Filter by {category}:</h3>
            {category === 'availability' ? (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters[category].includes(true)}
                    onChange={() => handleFilterChange(category, true)}
                  />
                  Available
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters[category].includes(false)}
                    onChange={() => handleFilterChange(category, false)}
                  />
                  Pending
                </label>
              </div>
            ) : (
              getUniqueValuesForCategory(animals, category).map(value => (
                <div key={value} style={{marginBottom: '10px'}}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters[category].includes(value)}
                      onChange={() => handleFilterChange(category, value)}
                    />
                    {value}
                  </label>
                </div>
              ))
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default FilterMenu;