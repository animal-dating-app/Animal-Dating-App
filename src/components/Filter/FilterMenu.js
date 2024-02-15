import React, { useState } from "react";

const FilterMenu = ({ selectedFilters, handleFilterChange, animals, showSortButtons }) => {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            {Object.keys(selectedFilters).map(category => (
                category !== 'type' && category !== 'dateCreated' && ( // Exclude 'dateCreated' category
                    <div key={category}>
                        {category === 'age' ? (
                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center' }}> Filter by {category}:
                                    <span
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: '5px',
                                            marginBottom: '18px',
                                            position: 'relative',
                                        }}

                                        onClick={() => setWhatsThisVisible(!whatsThisVisible)}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: 'blue',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: 'white',
                                                fontSize: '14px',
                                            }}
                                        >
                                            &#63;
                                        </div>
                                    </span>
                                </h3>
                                {whatsThisVisible && (
                                    <div style={{ border: '1px solid #ccc', padding: '10px', background: '#87CEEB', position: 'absolute', zIndex: 1, marginLeft: '-108px' }}>
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
    );
};

export default FilterMenu;