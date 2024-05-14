import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from "../../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { AnimalForm } from ".";

const EditAnimalModal = ({ showModal, setShowModal, loadAnimals, animal }) => {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [currentAnimal, setCurrentAnimal] = useState(animal);
    const [shouldClearImages, setShouldClearImages] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);


    useEffect(() => {
        setCurrentAnimal(animal);
    }, [animal]);

    const formRef = useRef(null);

    useEffect(() => {
        if (!showModal) {
            setUnsavedChanges(false);
            setImageDeleted(false);
        }
    }, [showModal]);

    useEffect(() => {
        if (shouldClearImages) {
            setTimeout(() => setShouldClearImages(false), 0);
        }
    }, [shouldClearImages]);

    const handleModalClose = () => {
        if (unsavedChanges && !imageDeleted) {
            const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to close?");
            if (confirmLeave) {
                setShowModal(false);
            }
        } else {
            setShowModal(false);
        }
    };

    const handleAnimalChange = (e) => {
        setUnsavedChanges(true);
        setImageDeleted(false);
        loadAnimals();
        setCurrentAnimal({ ...currentAnimal, [e.target.name]: e.target.value });
    };

    const handleUpdateAnimal = async () => {
        if (formRef.current && formRef.current.checkValidity()) {

            let curAnimalBody = {
                ...currentAnimal,
                shelterId: auth.currentUser.uid
            }

            delete curAnimalBody.id;

            await updateDoc(doc(db, "animals", currentAnimal.id), curAnimalBody);

            setShowModal(false);
            setUnsavedChanges(false);
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
                            <h5 className="modal-title">Edit Animal</h5>
                            <button type="button" className="btn-close" onClick={handleModalClose}></button>
                        </div>
                        <div className="modal-body">
                            <AnimalForm 
                                formRef={formRef} 
                                handleAnimalChange={handleAnimalChange} 
                                animal={currentAnimal} 
                                shouldClearImages={shouldClearImages}
                                setImageDeleted={setImageDeleted}    
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdateAnimal}>Update Animal</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditAnimalModal;