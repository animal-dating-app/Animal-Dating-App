import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Select from 'react-select';

import { AnimalGalleryCard } from "../components/Cards";
import AddAnimalModal from "../components/Cards/AddAnimalModal";
import EditAnimalModal from "../components/Cards/EditAnimalModal";

const Dashboard = () => {
    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const [animals, setAnimals] = useState([]);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAnimal, setCurrentAnimal] = useState({});

    const handleAddNewAnimalClick = () => {
        setShowAddModal(true);
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
        if (e.value === "") return;
    
        const operations = [];
        selectedAnimals.forEach(animalId => {
            if (e.value === "Delete") {
                operations.push(deleteDoc(doc(db, "animals", animalId)));
            } else if (e.value === "Set Unavailable") {
                operations.push(updateDoc(doc(db, "animals", animalId), { available: false, pendingAdoption: false }));
            } else if (e.value === "Set Available") {
                operations.push(updateDoc(doc(db, "animals", animalId), { available: true, pendingAdoption: false }));
            } else if (e.value === "Set Pending") {
                operations.push(updateDoc(doc(db, "animals", animalId), { available: false, pendingAdoption: true }));
            }
        });
    
        Promise.all(operations).then(() => {
            setSelectedAnimals([]);
            setSelectedAction(null);
            loadAnimals();
        }).catch(error => {
            console.error("Error in performing bulk action: ", error);
        });
    };

    const clickAnimal = (animal) => {
        setCurrentAnimal(animal);
        setShowEditModal(true);
    }

    const dropdownOptions = [
        { value: "Set Available", label: "Set Available" },
        { value: "Set Pending", label: "Set Pending" },
        { value: "Set Unavailable", label: "Set Unavailable" },
        { value: "Delete", label: "Delete" }
    ];

    // Styles copied from bootstrap form-control class to make react-select look like a bootstrap input
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            color: 'var(--bs-body-color)',
            backgroundColor: 'var(--bs-body-bg)',
            backgroundClip: 'padding-box',
            border: state.isFocused ? 'var(--bs-border-width) solid #86b7fe' : 'var(--bs-border-width) solid var(--bs-border-color)',
            borderRadius: 'var(--bs-border-radius)',
            transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            boxShadow: state.isFocused ? '0 0 0 .25rem rgba(13, 110, 253, .25)' : '',
            '&:hover': {},
        }),
    }

    return (
        <>
        <div className="container mb-4">
                <div className="row">
                    <div className="col-md-6 text-md-start">
                        <span className="me-2">{selectedAnimals.length} Animals Selected</span>
                        <Select className="d-inline-block w-auto" styles={selectStyles} onChange={handleDropdownChange} value={dropdownOptions.filter(option => option.value === selectedAction)}
                        options={dropdownOptions} isDisabled={selectedAnimals.length === 0} placeholder="Select Action" />  
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
                                <AnimalGalleryCard animal={animal} selectable={true} 
                                    selected={selectedAnimals.includes(animal.id)} onSelectAnimal={handleSelectAnimal} 
                                    onClickAnimal={clickAnimal} callToAction="" />
                            </div>
                        ))
                    }
                </div>
            </div>
            <AddAnimalModal showModal={showAddModal} setShowModal={setShowAddModal} loadAnimals={loadAnimals} />
            <EditAnimalModal showModal={showEditModal} setShowModal={setShowEditModal} loadAnimals={loadAnimals} animal={currentAnimal} />
        </>
    );
};

export default Dashboard;
