import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, where, query } from "firebase/firestore";
import { AnimalGalleryCard } from "../components/Cards";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../components/Search/SearchBar";
import FilterMenu from "../components/Filter/FilterMenu";
import FullScreenLoader from "../components/FullScreenLoader";

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
    const [loading, setLoading] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);
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
            setFadingOut(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Delay + duration of the fade out animation
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

            return { ...updatedFilters };
        });
    };

    const applyFilters = (animal) => {

        const filtersApplied = Object.values(selectedFilters).some(filter => filter.length > 0);
        
        if (searchTerm.trim() === "" && !filtersApplied) {
            
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

        if (searchTerm.trim() === "" && filtersApplied) {

            return true;
        }

        return animal.type.toLowerCase() === searchTerm.toLowerCase();
    };

    const filteredAnimals = animals.filter(animal => applyFilters(animal));

    const handleSortNewestFirst = () => {
        setAnimals([...animals].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
    };

    const handleSortOldestFirst = () => {
        setAnimals([...animals].sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)));
    };

    const handleResetSorting = () => {
        // Reset the animals state to its original order
        const animalRef = collection(db, "animals");
        const q = query(animalRef, where("status", "in", ["Available", "Pending", "Adopted"]));
        getDocs(q).then((animalSnapshot) => {
            const animalList = animalSnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            setAnimals(animalList);
        });
    };

    // Function to toggle the visibility of the entire filter section
    const toggleFilters = () => {
       
        setShowFilters(prevShowFilters => !prevShowFilters);
    
    };

    return (
        <>
        {loading && <FullScreenLoader fadingOut={fadingOut} />}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                toggleFilters={toggleFilters}
                showFilters={showFilters}
                showSortButtons={true}
                handleSortNewestFirst={handleSortNewestFirst}
                handleSortOldestFirst={handleSortOldestFirst}
                handleResetSorting={handleResetSorting}
            />

            {showFilters && (
                <FilterMenu
                    selectedFilters={selectedFilters}
                    handleFilterChange={handleFilterChange}
                    animals={animals}
                    onClose={() => setShowFilters(false)}
                />
            )}
            

            <div className="container">
                <div className="row pb-4">
                    {searchTerm === '' ? (
                        // If the search bar is empty, display the entire animal database or filtered animals
                        results.length === 0 ? (
                            filteredAnimals.map(animal => (
                                <div className="col-6 col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                    <AnimalGalleryCard animal={animal} onClickAnimal={() => navigate('/pet', {state:{pet:animal}})}/>
                                </div>
                            ))
                        ) : (
                            // If search bar is not empty, display only the searched animal type
                            results.map(animal => (
                                <div className="col-6 col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                    <AnimalGalleryCard animal={animal} onClickAnimal={() => navigate('/pet', {state:{pet:animal}})}/>
                                </div>
                            ))
                        )
                    ) : (
                        // If search bar is not empty, display only the searched animal type
                        filteredAnimals.map(animal => (
                            <div className="col-6 col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
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