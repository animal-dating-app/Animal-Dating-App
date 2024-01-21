import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from "../../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { AnimalForm } from ".";

const EditAnimalModal = ({ showModal, setShowModal, loadAnimals, animal }) => {
    const [currentAnimal, setCurrentAnimal] = useState(animal);

    useEffect(() => {
        setCurrentAnimal(animal);
    }, [animal]);

    const formRef = useRef(null);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleAnimalChange = (e) => {
        if (e.target.name === 'availability') {
            const isAvailable = e.target.value === 'true';
            const isPending = e.target.value === 'pending';
            setCurrentAnimal({ 
                ...currentAnimal, 
                available: isAvailable, 
                pendingAdoption: isPending 
            });
        } else {
            setCurrentAnimal({ ...currentAnimal, [e.target.name]: e.target.value });
        }
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
                            <AnimalForm formRef={formRef} handleAnimalChange={handleAnimalChange} animal={currentAnimal} />
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