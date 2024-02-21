import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Select from 'react-select';

import { AnimalGalleryCard } from "../components/Cards";
import AddAnimalModal from "../components/Cards/AddAnimalModal";
import EditAnimalModal from "../components/Cards/EditAnimalModal";
import FullScreenLoader from "../components/FullScreenLoader";

const Dashboard = () => {
    const [animals, setAnimals] = useState([]);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAnimal, setCurrentAnimal] = useState({});
    const [loading, setLoading] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    // Check if current user is a shelter (document in shelters collection with shelterId = currentUser.uid)
    const loadShelter = async () => {
        const q = query(collection(db, "shelters"), where("shelterId", "==", auth.currentUser.uid));
        const shelterSnapshot = await getDocs(q);
        if (shelterSnapshot.empty) {
            window.location.href = "/pets";
        }
    };

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
            setFadingOut(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Delay + duration of the fade out animation
        };

        getAnimals();
    };

    useEffect(() => {
        loadShelter().then(() => {
            loadAnimals()
        });
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
                operations.push(updateDoc(doc(db, "animals", animalId), { status: "Unavailable" }));
            } else if (e.value === "Set Available") {
                operations.push(updateDoc(doc(db, "animals", animalId), { status: "Available" }));
            } else if (e.value === "Set Pending") {
                operations.push(updateDoc(doc(db, "animals", animalId), { status: "Pending" }));
            } else if (e.value === "Set Adopted") {
                operations.push(updateDoc(doc(db, "animals", animalId), { status: "Adopted" }));
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
        { value: "Set Adopted", label: "Set Adopted" },
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

    const shelterSection = (sectionName, sectionId) => {
        if (animals.filter(animal => animal.status === sectionId).length === 0) return null;

        return (
            <div className="container">
                <h3 className="w-100 text-start pb-2"
                >{sectionName}</h3>
                <div className="row pb-4">
                {
                    animals.filter(animal => animal.status === sectionId).map(animal => (
                        <div className="col-6 col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                            <AnimalGalleryCard animal={animal} selectable={true} 
                                selected={selectedAnimals.includes(animal.id)} onSelectAnimal={handleSelectAnimal} 
                                onClickAnimal={clickAnimal} callToAction="" />
                        </div>
                    ))
                }
                </div>
            </div>
        );
    }

    return (
        <>
        { loading && <FullScreenLoader fadingOut={fadingOut} /> }
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
            {shelterSection("Pending Adoption", "Pending")}
            {shelterSection("Available for Adoption", "Available")}
            {shelterSection("Adopted", "Adopted")}
            {shelterSection("Unpublished", "Unavailable")}
            <AddAnimalModal showModal={showAddModal} setShowModal={setShowAddModal} loadAnimals={loadAnimals} />
            <EditAnimalModal showModal={showEditModal} setShowModal={setShowEditModal} loadAnimals={loadAnimals} animal={currentAnimal} />
        </>
    );
};

export default Dashboard;
