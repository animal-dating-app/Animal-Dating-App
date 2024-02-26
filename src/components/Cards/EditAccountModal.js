import React, { useState, useEffect } from 'react';
import { auth, db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import ShelterFrom from './ShelterForm';
import AdoptFrom from './AdoptForm';

const EditAccountModal = ({ showModal, setShowModal, user, setUser, isShelter }) => {

    const [currentUser, setCurrentUser] = useState(user);

    const handleChange = (e) => {
        setCurrentUser({...currentUser, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleUpdateAccount = async () => {

        let curAccountBody = { 
            ...currentUser
        }

        delete curAccountBody.id;

        // If email changed update Firebase Auth
        if (curAccountBody.email !== auth.currentUser.email) {
            await updateEmail(auth.currentUser, curAccountBody.email);
        }
        
        // Update Shelter 
        if (isShelter) {
            await updateDoc(doc(db, "shelters", currentUser.id), curAccountBody);
        } 
        // Update Adopt User
        else {
            await updateDoc(doc(db, "users", currentUser.id), curAccountBody);
        }
        
        setShowModal(false);
        setUser(currentUser);
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
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Account</h5>
                            <button type="button" className="btn-close" onClick={handleModalClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>

                                {isShelter && (
                                    <ShelterFrom currentUser={currentUser} handleChange={handleChange} />
                                )}
                                {!isShelter && (
                                    <AdoptFrom currentUser={currentUser} handleChange={handleChange} />
                                )}
                            </form> 
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdateAccount}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditAccountModal;