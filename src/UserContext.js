import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from "./firebaseConfig";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoaded, setUserLoaded] = useState(false);
    const [showUserLoader, setShowUserLoader] = useState(true);
    const [startFading, setStartFading] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setUserLoaded(true);

            setTimeout(() => {
                setStartFading(true);
            }, 400); // Delay before starting the fade out animation

            setTimeout(() => {
                setShowUserLoader(false);
            }, 1400); // Delay + duration of the fade out animation
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, userLoaded, showUserLoader, startFading }}>
            {children}
        </UserContext.Provider>
    );
};
