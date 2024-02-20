import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";

const Settings = () => {

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const [user, setUser] = useState({});
    const [shelter, setShelter] = useState(false);

    // ToDo - Get user info from database
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

        getShelterUser();
        getAdoptUser();

    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div>
            <h1>Account Settings Page</h1>

            {!shelter && ( 
                <div class="container mt-4">
                    <p>Adopt User</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Preferences</strong></p>
                    {user.preferences && (user.preferences.map(preference => (
                        <p>{preference}</p>
                    )))}
                </div>
            )}
            {shelter && ( 
                <div class="container mt-4">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Shelter Name:</strong> {user.name}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                </div>
            )} 
            <button className="btn btn-secondary btn-block">Edit Account</button>    
        </div>
    );
};

export default Settings;