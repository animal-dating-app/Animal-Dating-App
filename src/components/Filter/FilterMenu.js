import React, { useState } from "react";

const FilterMenu = ({ selectedFilters, handleFilterChange, animals, onClose }) => {
    const [whatsThisVisible, setWhatsThisVisible] = useState(false);

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

    const handleClose = () => {
        onClose();
    };

    return (
        <div>
            <div className="filter-menu">
            <button onClick={handleClose} style = {{
                                                    marginRight: '10px', 
                                                    padding: '10px', 
                                                    borderRadius: '5px', 
                                                    border: 'none', 
                                                    background: 'none', 
                                                    color: '#007bff', 
                                                    cursor: 'pointer'}}>Hide Filters</button>
                {Object.keys(selectedFilters).map(category => (
                    category !== 'type' && category !== 'dateCreated' && ( // Exclude 'dateCreated' category
                        <div key={category}>
                            {category === 'age' ? (
                                <div>
                                    <h3> Filter by {category}:
                                        <div
                                            style={{
                                                cursor: 'pointer',
                                                marginLeft: '5px',
                                                position: 'relative', 
                                                justifyContent: 'center'
                                            }}

                                            onClick={() => setWhatsThisVisible(!whatsThisVisible)}>
                                                
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    background: 'rgb(221, 237, 234)',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'rgb(128, 128, 128)',
                                                    fontSize: '14px'
                                                }}>

                                                &#63;
                                            </div>
                                        </div>
                                    </h3>
                                    {whatsThisVisible && (
                                        <div style={{ 
                                                        marginTop: '20px',
                                                        border: '1px solid #ccc', 
                                                        padding: '10px', 
                                                        background: 'rgb(221, 237, 234)', 
                                                        color: 'rgb(128, 128, 128)',
                                                        position: 'absolute', 
                                                        zIndex: 1 
                                                    }}>

                                            Age range explanation:
                                            <p>Adult: Animals that are between 3-7 years old. </p>
                                            <p>Senior: Animals that are 8 years old and older. </p>
                                            <p>Young: Animals that are between 1-3 years old. </p>
                                            <p>Puppy: Dogs that are younger than 1 year old. </p>
                                            <p>Kitten: Cats that are younger than 1 year old. </p>
                                        </div>
                                    )}
                                    {getUniqueValuesForCategory(animals, category).map(value => (
                                        <div key={value} style={{ marginBottom: '10px' }}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[category].includes(value)}
                                                    onChange={() => handleFilterChange(category, value)}
                                                />
                                                {value}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <br />
                                    <h3>Filter by {category}:</h3>
                                    {category === 'status' ? (
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[category].includes("Available")}
                                                    onChange={() => handleFilterChange(category, "Available")}
                                                />
                                                Available
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[category].includes("Pending")}
                                                    onChange={() => handleFilterChange(category, "Pending")}
                                                />
                                                Pending
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[category].includes("Adopted")}
                                                    onChange={() => handleFilterChange(category, "Adopted")}
                                                />
                                                Adopted
                                            </label>
                                        </div>
                                    ) : (
                                        getUniqueValuesForCategory(animals, category).map(value => (
                                            <div key={value} style={{ marginBottom: '10px' }}>
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
                            )}
                        </div>
                    )
                ))}
                </div>
        </div>
    );
};

export default FilterMenu;