import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Select from 'react-select';

import { AnimalGalleryCard } from "../components/Cards";
import AddAnimalModal from "../components/Cards/AddAnimalModal";
import EditAnimalModal from "../components/Cards/EditAnimalModal";
import EditShelterProfileModal from "../components/Cards/EditShelterProfileModal";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import RecentMessagesCard from "../components/Cards/RecentMessagesCard";
import { AdminContext } from "../adminContext";

const Dashboard = () => {
    const [animals, setAnimals] = useState([]);
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showShelterProfileModal, setShowShelterProfileModal] = useState(false);
    const [currentAnimal, setCurrentAnimal] = useState({});
    const [loading, setLoading] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);
    const [shelterDocId, setShelterDocId] = useState("");
    const [shelter, setShelter] = useState({});
    const {adminPreviewID} = useContext(AdminContext);

    const navigate = useNavigate();

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const currentUserId = (adminPreviewID && adminPreviewID.hasOwnProperty("shelter"))? adminPreviewID.shelter : auth.currentUser.uid;

    // Check if current user is a shelter (document in shelters collection with shelterId = currentUser.uid)
    const loadShelter = async () => {
        const q = query(collection(db, "shelters"), where("shelterId", "==", currentUserId));
        const shelterSnapshot = await getDocs(q);
        if (shelterSnapshot.empty) {
            window.location.href = "/pets";
        }

        setShelterDocId(shelterSnapshot.docs[0].id);
        setShelter(shelterSnapshot.docs[0].data());
    };

    const handleAddNewAnimalClick = () => {
        setShowAddModal(true);
    };
    

    const loadAnimals = async () => {
        const getAnimals = async () => {
            const q = query(collection(db, "animals"), where("shelterId", "==", currentUserId));
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

    const handleFeaturedClick = (animalId) => {
        const animal = animals.find(animal => animal.id === animalId);
        updateDoc(doc(db, "animals", animalId), { featured: !animal.featured }).then(() => {
            loadAnimals();
        }).catch(error => {
            console.error("Error in updating animal status: ", error);
        });
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
            } else if (e.value === "Set Featured") {
                operations.push(updateDoc(doc(db, "animals", animalId), { featured: true }));
            } else if (e.value === "Set Not Featured") {
                operations.push(updateDoc(doc(db, "animals", animalId), { featured: false }));
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
        { value: "Set Featured", label: "Set Featured" },
        { value: "Set Not Featured", label: "Set Not Featured" },
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
                                onClickAnimal={clickAnimal} callToAction="" 
                                onFeaturedClick={handleFeaturedClick}
                                />
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
                    <div className="col-md-6 text-md-end d-flex flex-row-reverse" style={{ gap: "0.5rem" }}>
                        <button className="btn btn-secondary" onClick={handleAddNewAnimalClick}>Add New Animal</button>
                        <button className="btn btn-secondary" onClick={() => navigate(`/shelter/${currentUserId}`)}>Public View</button>
                        <button className="btn btn-secondary" onClick={() => setShowShelterProfileModal(true)}>Edit Profile</button>
                    </div>
                </div>
            </div>
            <div className="container mb-4">
                <RecentMessagesCard shelter={shelter} />
            </div>
            { animals.length === 0 && !loading && (
                <div className="container">
                    <p className="text-start">
						You have no animals available for adoption. Add a new animal to get started!
					</p>
                </div>
            )}
            {shelterSection("Pending Adoption", "Pending")}
            {shelterSection("Available for Adoption", "Available")}
            {shelterSection("Adopted", "Adopted")}
            {shelterSection("Unpublished", "Unavailable")}
            <AddAnimalModal showModal={showAddModal} setShowModal={setShowAddModal} loadAnimals={loadAnimals} />
            <EditAnimalModal showModal={showEditModal} setShowModal={setShowEditModal} loadAnimals={loadAnimals} animal={currentAnimal} />
            <EditShelterProfileModal showModal={showShelterProfileModal} setShowModal={setShowShelterProfileModal} shelterDocId={shelterDocId} shelter={shelter} />
        </>
    );
};

export default Dashboard;
