import React, { useState, useEffect } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
    const [isActive, setIsActive] = useState(false); 
    const [isShelter, setShelter] = useState(false);
    let button;
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            // Check shelter docs for auth user ID
            const getShelterUser = async () => {
                const q = query(collection(db, "shelters"), where("shelterId", "==", user.uid));
                const shelterSnapshot = await getDocs(q);
                const shelterUser = shelterSnapshot.docs.map ( doc => {
                    return { id: doc.id, ...doc.data() };
                });
                // Update user if found
                if (shelterUser.length > 0) {
                    setShelter(true);
                }
            };
    
            // Search for shelter user 
            if (user) {
                getShelterUser();
            }
        };

        loadUser();
    }, [user]);

    // Log user out
    const handleLogout = () => {               
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");

        }).catch((error) => {
            // An error happened.
        });
    }

    // Check for user to update sign in /sign out button
    if (user) {
        button = <NavBtnLink onClick={ handleLogout }>Sign Out</NavBtnLink>
    }   
    else {
        button = <NavBtnLink to="/sign-in">Sign In</NavBtnLink>
    }

    return (
        <>
            <Nav>
                <Bars onClick={() => setIsActive(!isActive)} /> 

                <NavMenu active={isActive}> 
                    <NavLink to="/" onClick={() => setIsActive(false)}>
                        Home
                    </NavLink>
                        <NavLink to="/pets" onClick={() => setIsActive(false)}>
                            Pets
                        </NavLink>
                    {user && isShelter && (
                        <NavLink to="/dashboard" onClick={() => setIsActive(false)}>
                            Dashboard
                        </NavLink>
                    )}
                    {user && !isShelter && (
                        <NavLink to="/match" onClick={() => setIsActive(false)}>
                            Match
                        </NavLink>
                    )}
                    { user && (
                        <NavLink to="/settings" onClick={() => setIsActive(false)}>
                            Account
                        </NavLink>
                    )}
                    {!user && (
                        <NavLink to="/sign-up" onClick={() => setIsActive(false)}>
                            Sign Up
                        </NavLink>
                    )}
                </NavMenu>
                <NavBtn>
                    {button}
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;