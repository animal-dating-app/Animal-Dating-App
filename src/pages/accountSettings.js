import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import EditAccountModal from "../components/Cards/EditAccountModal";
import FavoriteAnimalTable from "../components/FavoriteAnimalsTable";

const Settings = () => {

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const [user, setUser] = useState({});
    const [isShelter, setShelter] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCredentials, setEditCredentials] = useState(false);

    // Get user info from shelter or user database
    const loadUser = async () => {
         
        // Check shelter docs for auth user ID
        const getShelterUser = async () => {
            const q = query(collection(db, "shelters"), where("shelterId", "==", auth.currentUser.uid));
            const shelterSnapshot = await getDocs(q);
            const shelterUser = shelterSnapshot.docs.map ( doc => {
                return { id: doc.id, ...doc.data() };
            });
            // Update user if found
            if (shelterUser.length > 0) {
                setUser(shelterUser[0]);
                setShelter(true);
            }
        };

        // Check user docs for auth user ID
        const getAdoptUser = async () => {
            const q = query(collection(db, "users"), where("userId", "==", auth.currentUser.uid));
            const adoptSnapshot = await getDocs(q);
            const adoptrUser = adoptSnapshot.docs.map ( doc => {
                return { id: doc.id, ...doc.data() };
            });
            // Update user if found
            if (adoptrUser.length > 0) {
                setUser(adoptrUser[0]);
            }
        };

        // Search for shelter user 
        getShelterUser();

        // Search for adopt user if not found in shelter
        if (!isShelter) {
            getAdoptUser();
        } 
    
        setUser(user);
    };

    useEffect(() => {
        loadUser();

        // Temp fix
        // eslint-disable-next-line
    }, []);

    const clickEditAccount = () => {
        setShowEditModal(true);
    };

    const clickEditSignIn = () => {
        setEditCredentials(true);
        setShowEditModal(true);
    };

    return (
        <div>
            <h1>Account Settings</h1>
            <div className="container mt-4">
                {/* Adopter */}
                {!isShelter && ( 
                    <div className="container mt-4">
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Preferences</strong></p>
                        {user.preferences && (user.preferences.map((preference, index) => (
                            <p key={index}>{preference}</p>
                        )))}
                    </div>
                )}
                {/* Shelter */}
                {isShelter && ( 
                    <div className="container mt-4">
                        {user.hasOwnProperty('email') && (
                            <p><strong>Public Email:</strong> {user.email}</p>
                        )}
                        <p><strong>Shelter Name:</strong> {user.name}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                    </div>
                )}
                <button className="btn btn-primary btn-block" onClick={clickEditAccount} style={{marginBottom: "0.25rem", width: "150px"}}>
                    Edit Account</button> 
                <br></br>
                <button className="btn btn-secondary btn-block" onClick={clickEditSignIn} style={{marginTop: "0.25rem",  width: "150px"}}>
                    Edit Sign In Info</button>    
            </div>
                <FavoriteAnimalTable />
                <EditAccountModal showModal={showEditModal} setShowModal={setShowEditModal} user={user} setUser={setUser} 
                    isShelter={isShelter} editCredentials={editCredentials} setEditCredentials={setEditCredentials}/>
        </div>
    );
};

export default Settings;