import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AnimalGalleryCard } from "../../components/Cards";
 
const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const animalRef = collection(db, 'animals');
        const querySnapshot = await getDocs(animalRef);
    
        const searchResults = querySnapshot.docs
        .map(doc => ({
            searchTerm: doc.searchTerm,
            ...doc.data() 
        }))
        .filter(animal => animal.type.toLowerCase() === searchTerm.toLowerCase());

        if (searchResults.length === 0) {
           alert("Sorry we do not have " + searchTerm + " in our database just yet. Please stay tuned!");
        }
    
        setResults(searchResults);
        setLoading(false);
        
    };
        
    return (
        <div className="container">
            <div className="row pb-4">
            <form onSubmit={handleSearch}>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for an animal type"
                />
                <button type="submit">Search</button>
            </form>
        
            {loading && <p>Loading...</p>}
            
            {results.length > 0 && results.map(animal => (
                <div class="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                    <AnimalGalleryCard animal={animal} />
                </div>
                ))}
            
            </div>
        </div>
    );
};
 
export default SearchBar;