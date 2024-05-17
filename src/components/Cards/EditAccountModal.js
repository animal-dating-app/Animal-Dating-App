import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import ShelterFrom from './ShelterForm';
import AdoptFrom from './AdoptForm';
import CredentialForm from './CredentialForm';

const EditAccountModal = ({ showModal, setShowModal, user, setUser, isShelter, editCredentials, setEditCredentials }) => {

    const [currentUser, setCurrentUser] = useState(JSON.parse(JSON.stringify(user)));
    const [reauthenticate, setReauthenticate] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const editingCredentials = editCredentials;
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const formRef = useRef(null);

    const handleChange = (e) => {

        // Handle Shelter Header Delete
        if(e.target.name === "imgDelBtn") {
            const value = e.target.value;
            const index = currentUser.headerImages.indexOf(value);
            let newImages = [...currentUser.headerImages];
            newImages.splice(index, 1);
            setCurrentUser({ ...currentUser, headerImages: newImages });  
        }
        else if (e.target.name === "preferences") {
            const value = e.target.value;
            const pressed = e.target.ariaPressed;

            if (pressed === "true") {
                let updatedUser = currentUser;
                updatedUser.preferences.push(value);
                setCurrentUser(updatedUser);
            } 
            else {
                const index = currentUser.preferences.indexOf(value);
                if (index > -1) {
                    let updatedUser = currentUser;
                    updatedUser.preferences.splice(index, 1); 
                    setCurrentUser(updatedUser);
                }
            } 
        }
        else {
            setCurrentUser({...currentUser, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        const userCopy = JSON.parse(JSON.stringify(user))
        setCurrentUser(userCopy);
        setEmail(auth.currentUser.email);
    }, [user]);

    const handleModalClose = () => {
        setShowModal(false);
        if (editingCredentials) {
            setEditCredentials(false);
        }
        if (reauthenticate) {
            setReauthenticate(false);
        }
    };

    // Update account setting in database
    const handleUpdateAccount = async () => {

        let curAccountBody = {...currentUser};
        delete curAccountBody.id;
        
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

    // Reauthenticate user 
    const handleReauthenticate = () => {
        setPasswordError(false);
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
            setReauthenticate(false);
          })
          .catch((error) => {
            setPasswordError(true);
          });
    };

    // Update login credentials in Firebase Auth
    const handleCredentialUpdate = async () => {
        setPasswordError(false);
        setPasswordMismatch(false);

        if (formRef.current && formRef.current.checkValidity()) { 
            
            // If email changed update Firebase Auth
            if (email !== auth.currentUser.email) {
                try {
                    await updateEmail(auth.currentUser, email)
                    .then(setShowModal(false));
                }
                // Reauthenticate user if session expired
                catch (error) {
                    const errorCode = error.code;
                    if(errorCode.includes("recent")) {
                        setReauthenticate(true);
                        setShowModal(true);
                    }
                }
            }

            // If password changed update Firebase Auth
            if (newPassword !== '') {
                // Make sure both password fields match
                if (newPassword === confirmedPassword) {
                    updatePassword(auth.currentUser, newPassword).then(() => {
                        // Set variables 
                        setEditCredentials(false);
                        setShowModal(false);
                        setNewPassword('');
                        setConfirmedPassword('');
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        // User needs to reauthenticate
                        if(errorCode.includes("recent")) {
                            setReauthenticate(true);
                        } 
                        // Passwowrd Error
                        else {
                            setPasswordError(true);
                        }
                    });
                }   
                else {
                    setPasswordMismatch(true);
                }
            }
        }
        else {
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
                <div className={(!isShelter) ? 
                "modal-dialog modal-dialog-centered modal-l" 
                :"modal-dialog modal-dialog-centered modal-xl" }>
                    <div className="modal-content">
                        <div className="modal-header">
                            {editingCredentials === false && ( 
                                <h5 className="modal-title">Edit Account</h5>
                            )}
                            {editingCredentials === true &&( 
                                <h5 className="modal-title">Edit Sign In</h5>
                            )}

                            <button type="button" className="btn-close" onClick={handleModalClose}></button>
                        </div>
                        {reauthenticate === true && (
                            <div> 
                                <div className="modal-body">
                                    <h3>Re-Autenticate</h3> 
                                    <div className="alert w-50 mx-auto alert-info" role="alert">
                                        Please verify your password to continue.
                                    </div>  
                                    <div className="col-sm-2 mx-auto">
                                        {passwordError === true && (
                                        <div className="alert alert-danger" role="alert">
                                            Invalid Password
                                        </div>   
                                        )}
                                        <form ref={formRef}>
                                            <div>
                                                <label htmlFor="password"><strong>Password</strong></label>
                                                <br></br>
                                                <input id="password" name="password" type="password" placeholder="Password"                                                                                                                                         
                                                    onChange={(e)=>setPassword(e.target.value)} required/>
                                            </div>
                                            <br></br>
                                        </form>      
                                    </div>              
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleReauthenticate}>Confirm</button>
                                </div>
                            </div>
                        )}
                        {reauthenticate === false && ( 
                            <div>
                                <div className="modal-body">
                                    <form ref={formRef}>
                                        {editingCredentials === true && (
                                            <CredentialForm email={email} setEmail={setEmail} newPassword={newPassword} setNewPassword={setNewPassword} 
                                                confirmedPassword={confirmedPassword} setConfirmedPassword={setConfirmedPassword} passwordError={passwordError} 
                                                mismatch={passwordMismatch}/>
                                        )}
                                        {isShelter && editingCredentials === false && (
                                            <ShelterFrom currentUser={currentUser} setCurrentUser={setCurrentUser} handleChange={handleChange} />
                                        )}
                                        {!isShelter && editingCredentials === false &&(
                                            <AdoptFrom currentUser={currentUser} handleChange={handleChange} isAdmin={false}/>
                                        )}
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                                    {editingCredentials === true && ( 
                                        <button type="button" className="btn btn-primary" onClick={handleCredentialUpdate}>Update</button>
                                    )}
                                    {editingCredentials === false && ( 
                                        <button type="button" className="btn btn-primary" onClick={handleUpdateAccount}>Update</button>
                                    )}
                                </div>
                            </div>
                        )};
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditAccountModal;