import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";

import { AnimalGalleryCard } from "../components/Cards";
import AddAnimalModal from "../components/Cards/AddAnimalModal";

const Dashboard = () => {
    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const [animals, setAnimals] = useState([]);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [selectedAction, setSelectedAction] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleAddNewAnimalClick = () => {
        setShowModal(true);
    };

    const loadAnimals = async () => {
        const getAnimals = async () => {
            const q = query(collection(db, "animals"), where("shelterId", "==", auth.currentUser.uid));
            const animalSnapshot = await getDocs(q);
            const animalList = animalSnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            setAnimals(animalList);
        };

        getAnimals();
    };

    useEffect(() => {
        loadAnimals();
    }, []);

    const handleSelectAnimal = (animalId) => {
        if (selectedAnimals.includes(animalId)) {
            setSelectedAnimals(selectedAnimals.filter(id => id !== animalId));
        } else {
            setSelectedAnimals([...selectedAnimals, animalId]);
        }
    };

    const handleDropdownChange = (e) => {
        setSelectedAction(e.target.value);
        if (e.target.value === "") return;
    
        const operations = [];
        selectedAnimals.forEach(animalId => {
            if (e.target.value === "Delete") {
                operations.push(deleteDoc(doc(db, "animals", animalId)));
            } else if (e.target.value === "Set Unavailable") {
                operations.push(updateDoc(doc(db, "animals", animalId), { available: false }));
            } else if (e.target.value === "Set Available") {
                operations.push(updateDoc(doc(db, "animals", animalId), { available: true }));
            }
        });
    
        Promise.all(operations).then(() => {
            setSelectedAnimals([]);
            setSelectedAction("");
            loadAnimals();
        }).catch(error => {
            console.error("Error in performing bulk action: ", error);
        });
    };

    return (
        <>
        <div className="container mb-4">
                <div className="row">
                    <div className="col-md-6 text-md-start">
                        <span className="me-2">{selectedAnimals.length} Animals Selected</span>
                        <select 
                            className="form-select form-select-sm d-inline w-auto" 
                            disabled={selectedAnimals.length === 0} 
                            onChange={handleDropdownChange}
                            value={selectedAction}
                        >
                            <option disabled value="">Select Action</option>
                            <option value="Set Unavailable">Set Unavailable</option>
                            <option value="Set Available">Set Available</option>
                            <option value="Delete">Delete</option>
                        </select>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <button className="btn btn-secondary" onClick={handleAddNewAnimalClick}>Add New Animal</button>
                    </div>
                </div>
            </div>
            <div className="container">
                {animals.length === 0 && <p>You have no animals in your shelter.</p>}
                <div className="row pb-4">
                    {
                        animals.map(animal => (
                            <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                                <AnimalGalleryCard animal={animal} selectable={true} selected={selectedAnimals.includes(animal.id)} onSelectAnimal={handleSelectAnimal} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <AddAnimalModal showModal={showModal} setShowModal={setShowModal} loadAnimals={loadAnimals} />
        </>
    );
};

export default Dashboard;
