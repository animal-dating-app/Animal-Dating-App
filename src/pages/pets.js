import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, where, query } from "firebase/firestore";
import { AnimalGalleryCard } from "../components/Cards";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../components/Search/SearchBar";
import FilterMenu from "../components/Filter/FilterMenu";

const Pets = () => {
    const [animals, setAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        breed: [],
        age: [],
        gender: [],
        status: [],
        dateCreated: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        const getAnimals = async () => {
            const animalRef = collection(db, "animals");
            const q = query(animalRef, where("status", "in", ["Available", "Pending", "Adopted"]));
            const animalSnapshot = await getDocs(q);
            const animalList = animalSnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            setAnimals(animalList);
        };

        getAnimals();
    }, []);

    useEffect(() => {
        // Add an event listener to the search input field
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('input', handleInputChange);

        return () => {

            searchInput.removeEventListener('input', handleInputChange);

        };
    }, []);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);

        if (inputValue.trim() === "") {
            // Reset the results when the input field is empty
            setResults([]); 
            // Reset filter checkboxes by setting all filter categories to empty arrays
            setSelectedFilters({
                type: [],
                breed: [],
                age: [],
                gender: [],
                status: [],
                dateCreated: [],
            });
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
    
        const animalRef = collection(db, 'animals');
        const q = query(animalRef,  where("status", "in", ["Available", "Pending", "Adopted"]));
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

            if (category === "status") {
                const statusValue = animal.status;

                if (selectedFilters[category].length > 0 && !selectedFilters[category].includes(statusValue)) {

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

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                toggleFilters={toggleFilters}
                showFilters={showFilters}
            />

            {showFilters && (
                <FilterMenu
                    selectedFilters={selectedFilters}
                    handleFilterChange={handleFilterChange}
                    animals={animals}
                />
            )}

            
            <div className="container">
                <div className="row pb-4">
                    {searchTerm === '' ? (
                        // If the search bar is empty, display the entire animal database
                        results.length === 0 ? (
                            animals.map(animal => (
                                <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                    <AnimalGalleryCard animal={animal} onClickAnimal={() => navigate('/pet', {state:{pet:animal}})}/>
                                </div>
                            ))
                        ) : (
                            // If search bar is not empty, display only the searched animal type
                            results.map(animal => (
                                <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                    <AnimalGalleryCard animal={animal} onClickAnimal={() => navigate('/pet', {state:{pet:animal}})}/>
                                </div>
                            ))
                        )
                    ) : (
                        // If search bar is not empty, display only the searched animal type
                        filteredAnimals.map(animal => (
                            <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                <AnimalGalleryCard animal={animal} onClickAnimal={() => navigate('/pet', {state:{pet:animal}})}/>
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