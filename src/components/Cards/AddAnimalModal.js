import React, { useState, useRef } from 'react';
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { AnimalGalleryCard } from ".";

const AddAnimalModal = ({ showModal, setShowModal, loadAnimals }) => {
    const [newAnimal, setNewAnimal] = useState({
        name: "",
        age: "",
        breed: "",
        description: "",
        type: "",
        gender: "",
        pictureUri: "",
        available: true,
        pendingAdoption: false
    });

    const formRef = useRef(null);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleNewAnimalChange = (e) => {
        if (e.target.name === 'availability') {
            const isAvailable = e.target.value === 'true';
            const isPending = e.target.value === 'pending';
            setNewAnimal({ 
                ...newAnimal, 
                available: isAvailable, 
                pendingAdoption: isPending 
            });

            console.log(newAnimal)
        } else {
            setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
        }
    };

    const handleAddNewAnimal = async () => {
        if (formRef.current && formRef.current.checkValidity()) {
            await addDoc(collection(db, "animals"), {
                ...newAnimal,
                shelterId: auth.currentUser.uid
            });
        setShowModal(false);
        setNewAnimal({
            name: "",
            age: "",
            breed: "",
            description: "",
            type: "",
            gender: "",
            pictureUri: "",
            available: true
        });
        loadAnimals(); // Refresh the list of animals
        } else {
            formRef.current && formRef.current.reportValidity();
        }
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
        backdropFilter: 'blur(5px)', // Apply blur effect (not supported in all browsers)
        zIndex: 10 // Ensure it's above other content but below the modal
    };

    return (
        <>
            { showModal && <div style={overlayStyle}></div> }
            <div className={`modal ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex="-1">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Animal</h5>
                            <button type="button" className="btn-close" onClick={handleModalClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-lg-6 mb-4 text-start">
                                    <form ref={formRef}>
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control mb-2" id="name" placeholder="Name" name="name" value={newAnimal.name} onChange={handleNewAnimalChange} required />
                                        
                                        <label htmlFor="type" className="form-label text-start">Type</label>
                                        <select className="form-select mb-2" id="type" name="type" value={newAnimal.type} onChange={handleNewAnimalChange} required>
                                            <option value="">Select Type</option>
                                            <option value="Dog">Dog</option>
                                            <option value="Cat">Cat</option>
                                            <option value="Rabbit">Rabbit</option>
                                            <option value="Hamster">Hamster</option>
                                            <option value="Bird">Bird</option>
                                            <option value="Fish">Fish</option>
                                            <option value="Turtle">Turtle</option>
                                            <option value="Snake">Snake</option>
                                            <option value="Lizard">Lizard</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        
                                        <label htmlFor="breed" className="form-label">Breed</label>
                                        <input type="text" className="form-control mb-2" id="breed" placeholder="Breed" name="breed" value={newAnimal.breed} onChange={handleNewAnimalChange} required />

                                        <label htmlFor="age" className="form-label text-start">Age</label>
                                        <input type="number" className="form-control mb-2" id="age" placeholder="Age" name="age" value={newAnimal.age} onChange={handleNewAnimalChange} required min="0" />                                            
                                        
                                        <label htmlFor="gender" className="form-label text-start">Gender</label>
                                        <select className="form-select mb-2" id="gender" name="gender" value={newAnimal.gender} onChange={handleNewAnimalChange} required>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>

                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea className="form-control mb-2" id="description" placeholder="Description" name="description" value={newAnimal.description} onChange={handleNewAnimalChange}></textarea>

                                        <label htmlFor="pictureUri" className="form-label text-start">Image URL</label>
                                        <input type="url" className="form-control mb-2" id="pictureUri" placeholder="Image URL" name="pictureUri" value={newAnimal.pictureUri} onChange={handleNewAnimalChange} pattern="https?://.+" />

                                        <label htmlFor="availability" className="form-label">Status</label>
                                        <select className="form-select mb-2" id="availability" name="availability" value={newAnimal.pendingAdoption === true ? "pending" : newAnimal.available} onChange={handleNewAnimalChange} required>
                                            <option value="true">Available</option>
                                            <option value="pending">Pending</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                    </form>
                                </div>
                                <div className="col-lg-6 mt-lg-0 mt-4">
                                    <div>
                                        <AnimalGalleryCard animal={newAnimal} selectable={false} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddNewAnimal}>Add Animal</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddAnimalModal;