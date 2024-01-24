import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, where, query, or } from "firebase/firestore";
import { AnimalGalleryCard } from "../components/Cards";

const Pets = () => {
    const [animals, setAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    //const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        breed: [],
        age: [],
        gender: [],
        availability: [],
    });

    useEffect(() => {
        const getAnimals = async () => {
            const animalRef = collection(db, "animals");
            const q = query(animalRef, or(where("available", "==", true), where("pendingAdoption", "==", true)));
            const animalSnapshot = await getDocs(q);
            const animalList = animalSnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            setAnimals(animalList);
        };

        getAnimals();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        //setLoading(true);
    
        const animalRef = collection(db, 'animals');
        const q = query(animalRef, or(where("available", "==", true), where("pendingAdoption", "==", true)));
        const querySnapshot = await getDocs(q);
    
        const searchResults = querySnapshot.docs
        .map(doc => ({
            searchTerm: doc.searchTerm,
            ...doc.data() 
        }))
        .filter(animal => animal.type.toLowerCase() === searchTerm.toLowerCase());

        if (searchResults.length === 0 && searchTerm !== '') {
            alert("Sorry we do not have " + searchTerm + " in our database just yet. Please stay tuned!");
         }
    
        setResults(searchResults);
        //setLoading(false);
    };

    const handleFilterChange = (filterCategory, filterValue) => {
        setSelectedFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };

            if (updatedFilters[filterCategory].includes(filterValue)) {

                updatedFilters[filterCategory] = updatedFilters[filterCategory].filter(item => item !== filterValue);

            } else {

                updatedFilters[filterCategory] = [...updatedFilters[filterCategory], filterValue];
            }

            return updatedFilters;
        });
    };

    const applyFilters = (animal) => {

        if (searchTerm.trim() === "") {

            return true;
        }

        // Check if animal matches all selected filter categories
        for (const category in selectedFilters) {

            if (category === "availability") {
                const availabilityValue = animal.available;

                if (selectedFilters[category].length > 0 && !selectedFilters[category].includes(availabilityValue)) {

                    return false;
                }

            } else if (selectedFilters[category].length > 0 && !selectedFilters[category].includes(animal[category])) {
                return false;
            }     
        }

        return animal.type.toLowerCase() === searchTerm.toLowerCase();
    };

    const filteredAnimals = animals.filter(animal => applyFilters(animal));

    // Function to toggle the visibility of the entire filter section
    const toggleFilters = () => {

        setShowFilters(prevShowFilters => !prevShowFilters);

    };

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
        <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

            {showFilters && (
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
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters[category].includes(false)}
                                                onChange={() => handleFilterChange(category, false)}
                                            />
                                            No
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
            )}

            
            <div className="container">
                <div className="row pb-4">
                    {searchTerm === '' ? (
                        // If the search bar is empty, display the entire animal database
                        results.length === 0 ? (
                            animals.map(animal => (
                                <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                    <AnimalGalleryCard animal={animal} />
                                </div>
                            ))
                        ) : (
                            // If search bar is not empty, display only the searched animal type
                            results.map(animal => (
                                <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                    <AnimalGalleryCard animal={animal} />
                                </div>
                            ))
                        )
                    ) : (
                        // If search bar is not empty, display only the searched animal type
                        filteredAnimals.map(animal => (
                            <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                <AnimalGalleryCard animal={animal} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default Pets;
