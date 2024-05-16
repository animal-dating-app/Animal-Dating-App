import React, { useContext, useState, useEffect } from "react";
//import { doc, deleteDoc } from "firebase/firestore";
import ShelterForm from "./ShelterForm";
import AdoptForm from "./AdoptForm";
import AnimalForm from "./AnimalForm";
import { AdminContext } from "../../adminContext";

const AdminInfoModal = ({showModal, setShowModal, userInfo, setUserInfo, userType, handleDelete, handleUpdate, formRef, setUpdated}) => {

    const [user, setUser] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const {setAdminPreviewID} = useContext(AdminContext);

    useEffect(() => {
        if (userInfo) {
            const userCopy = JSON.parse(JSON.stringify(userInfo))
            setUser(userCopy);
        } 
        else {
            setUser(userInfo);
        }
    }, [userInfo])

    const handleClose = () => {
        setShowModal(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Discard changes
        //setUser(userInfo);
        setIsEditing(false);
    };

    // Set Admin preview variable
    const handlePreview = () => {
        if (userType === "Shelter") {
            setAdminPreviewID({"shelter": userInfo.shelterId});
        }
        else if (userType === "Adopter") {
            setAdminPreviewID({"adopter": userInfo.userId});
        }
        setShowModal(false);
    };

    // Start Update 
    const handleUpdateInit = (uid) => {
        setUserInfo(user);
        handleUpdate(uid, user);
        setIsEditing(false);
        setUpdated(true);
    };

    // Handle input change
    const handleChange = (e) => {

        // Handle Shelter Header Delete
        if(e.target.name === "imgDelBtn") {
            const value = e.target.value;
            const index = user.headerImages.indexOf(value);
            let newImages = [...user.headerImages];
            newImages.splice(index, 1);
            setUser({ ...user, headerImages: newImages });  
        }
        // Handle Adopter favorite pets change 
        else if(e.target.name === "favDelBtn") {
            const value = e.target.value;
            const index = user.favorites.indexOf(value);
            let newFavorites = [...user.favorites];
            newFavorites.splice(index, 1);
            setUser({ ...user, favorites: newFavorites });  
        }
        // Handle Adopter dismissed pets change 
        else if(e.target.name === "disDelBtn") {
            const value = e.target.value;
            const index = user.dismissedPets.indexOf(value);
            let newDismissedPets = [...user.dismissedPets];
            newDismissedPets.splice(index, 1);
            setUser({ ...user, dismissedPets: newDismissedPets });  
        }
        // Handle Adopter preference change
        else if (e.target.name === "preferences") {
            const value = e.target.value;
            const pressed = e.target.ariaPressed;

            if (pressed === "true") {
                let updatedUser = user;
                updatedUser.preferences.push(value);
                setUser(updatedUser);
            } 
            else {
                const index = user.preferences.indexOf(value);
                if (index > -1) {
                    let updatedUser = user;
                    updatedUser.preferences.splice(index, 1); 
                    setUser(updatedUser);
                }
            } 
        }
        // All other changes
        else {
            setUser({...user, [e.target.name]: e.target.value });
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
                <div className={!(isEditing && userType === "Animal") ? 
                    "modal-dialog modal-dialog-centered modal-l" 
                    :"modal-dialog modal-dialog-centered modal-xl" }>
                    <div className="modal-content">
                        <div className="modal-header">
                                <h5 className="modal-title">{userType} Data</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body" align="left">
                            {isEditing && (
                                <div>
                                    {userType === "Shelter" && ( 
                                        <ShelterForm currentUser={user} setCurrentUser={setUser} handleChange={handleChange} />
                                    )}
                                    {userType === "Animal" && ( 
                                        <AnimalForm useRef={formRef} handleAnimalChange={handleChange} animal={user} />
                                        // <AdminAnimalForm currentUser={user} handleChange={handleChange} />
                                    )}
                                    {userType === "Adopter" && ( 
                                        <AdoptForm currentUser={user} handleChange={handleChange} isAdmin={true} />
                                    )}
                                    
                                </div>
                            )}
                            {!isEditing && (
                                <>
                                {userType === "Shelter" && (
                                    <div>
                                        <div className="m-1"><b>UID:</b> {userInfo.id}</div>
                                        <div className="m-1"><b>Shelter Name:</b> {userInfo.name}</div>
                                        <div className="m-1"><b>Address:</b> {userInfo.address}</div>
                                        <div className="m-1"><b>Phone Number:</b> {userInfo.phone}</div>
                                        <div className="m-1"><b>Contact Email:</b> {userInfo.email}</div>
                                        <div className="m-1"><b>Description:</b> {userInfo.description}</div>
                                        <div className="m-1"><b>Header Images</b></div> 
                                        <div className="m-1">
                                            {userInfo.headerImages && userInfo.headerImages.length > 0 && userInfo.headerImages.map((image, i) => {
                                                if (i === (userInfo.headerImages.length - 1)) {
                                                    return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%"}}></img>
                                                }
                                                else {
                                                    return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%", marginBottom:"16px"}}></img>
                                                }                                                   
                                            })}
                                        </div>                                                
                                    </div>
                                )}
                                {userType === "Animal" && (
                                    <div> 
                                        <div className="m-1"><b>UID:</b> {userInfo.id}</div>
                                        <div className="m-1"><b>Name:</b> {userInfo.name}</div>
                                        <div className="m-1"><b>Type:</b> {userInfo.type}</div>
                                        <div className="m-1"><b>Breed:</b> {userInfo.breed}</div>
                                        <div className="m-1"><b>Gender:</b> {userInfo.gender}</div>
                                        <div className="m-1"><b>Age:</b> {userInfo.age}</div>
                                        <div className="m-1"><b>Shelter ID:</b> {userInfo.sid ? userInfo.sid : "Error getting Shelter ID"}</div>
                                        <div className="m-1"><b>Status:</b> {userInfo.status}</div>
                                        <div className="m-1"><b>Date Created:</b> {userInfo.dateCreated}</div>
                                        <div className="m-1"><b>Disposition:</b> {userInfo.disposition && userInfo.disposition.map((disp, i) => {
                                            if (i === (userInfo.disposition.length - 1)) {
                                                return (<p key={i} style={{display: "inline"}}>{disp}</p>)
                                            }
                                            else {
                                                return (<p key={i} style={{display: "inline"}}>{disp}, </p>)
                                            }
                                        })}</div>
                                        <div className="m-1"><b>Description:</b> {userInfo.name}</div> 
                                        <div className="m-1"><b>Images</b></div>
                                        {userInfo.pictureUri && !(typeof userInfo.pictureUri == "string") && userInfo.pictureUri.map((image, i) => {
                                            if (i === (userInfo.pictureUri.length - 1)) {
                                                return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%"}}></img>
                                            }
                                            else {
                                                return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%", marginBottom:"16px"}}></img>
                                            }                                                   
                                        })}
                                        {userInfo.pictureUri && typeof userInfo.pictureUri == "string" &&  (
                                            <img src={userInfo.pictureUri} alt="Animal Images" style={{maxWidth: "100%"}}></img>
                                        )}       
                                    </div>
                                )} 
                                {userType === "Adopter" && (
                                    <div> 
                                        <div className="m-1"><b>UID:</b> {userInfo.id}</div>
                                        <div className="m-1"><b>First Name:</b> {userInfo.firstName}</div>
                                        <div className="m-1"><b>Last Name:</b> {userInfo.lastName}</div>
                                        <div className="m-1"><b>Preferences:</b> {userInfo.preferences && userInfo.preferences.map((preference, i) => {
                                                if (i === (userInfo.preferences.length - 1)) {
                                                    return (<p key={i} style={{display: "inline"}}>{preference}</p>)
                                                }
                                                else {
                                                    return (<p key={i} style={{display: "inline"}}>{preference}, </p>)
                                                }
                                            })}  
                                        </div>
                                        <div className="m-1"><b>Favorite Animal IDs:</b> {userInfo.favorites && userInfo.favorites.map((favorite, i) => {
                                                if (i === (userInfo.favorites.length - 1)) {
                                                    return (<p key={i} style={{display: "inline"}}>{favorite}</p>)
                                                }
                                                else {
                                                    return (<p key={i} style={{display: "inline"}}>{favorite}, </p>)
                                                }
                                            })}
                                        </div>
                                        <div className="m-1"><b>Dismissed Animal IDs:</b> {userInfo.dismissedPets && userInfo.dismissedPets.map((pet, i) => {
                                                if (i === (userInfo.dismissedPets.length - 1)) {
                                                    return (<p key={i} style={{display: "inline"}}>{pet}</p>)
                                                }
                                                else {
                                                    return (<p key={i} style={{display: "inline"}}>{pet}, </p>)
                                                }
                                            })}
                                        </div>
                                    </div>
                                )}  
                            </>
                            )}
                        </div>
                        <div className="modal-footer">
                            {!isEditing && (
                                <>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handleDelete(userInfo.id)}>Delete</button> 
                                {userType && (userType === "Shelter" || userType === "Adopter") && (
                                    <button type="button" className="btn btn-info" data-bs-dismiss="modal" onClick={() => handlePreview(userInfo.id)}>Preview</button> 
                                )}
                                </>
                            )}
                            {!isEditing ? <button type="button" className="btn btn-primary" onClick={handleEdit}>Edit</button> 
                                : <button type="button" className="btn btn-primary" onClick={() => handleUpdateInit(userInfo.id)}>Update</button>}

                            {!isEditing ? <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button> 
                                : <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>}
                        </div>                       
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminInfoModal;