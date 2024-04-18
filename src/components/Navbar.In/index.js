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
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = ({ user }) => {
    const [isActive, setIsActive] = useState(false); 
    const [isShelter, setShelter] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    let button;
    const navigate = useNavigate();

    const adminUID = "L89J59dWmKYqWupE2ngVY2NIhNq1";

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

                // Check for admin 
                if (user.uid === adminUID) {
                    setAdmin(true);
                } 
                // Else check for shelter user
                else {
                    setAdmin(false);
                    getShelterUser();    
                }
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
                        {/* Not Admin */}
                        {user && !isAdmin && (
                            <>
                            {isShelter && (
                                <NavLink to="/dashboard" onClick={() => setIsActive(false)}>
                                    Dashboard
                                </NavLink>
                            )}
                            {!isShelter && (
                                <NavLink to="/match" onClick={() => setIsActive(false)}>
                                    Match
                                </NavLink>
                            )}
                            <NavLink to="/settings" onClick={() => setIsActive(false)}>
                                Account
                            </NavLink>  
                            </>
                        )}
                        {/* Admin */}
                        {user && isAdmin && (
                            <NavLink to="/admin" onClick={() => setIsActive(false)}>
                                Admin
                            </NavLink>
                        )}

                        {!user && (
                            <NavLink to="/sign-up" onClick={() => setIsActive(false)}>
                                Sign Up
                            </NavLink>
                        )}
                </NavMenu>

                <span style={{display: "flex", alignItems: "center"}}>
                {user && (
                        <NavLink to="/messages" onClick={() => setIsActive(false)}>
                            <FontAwesomeIcon icon={faInbox} />
                        </NavLink>
                    )}
                    <NavBtn>
                        {button}
                    </NavBtn>
                </span>

            </Nav>
        </>
    );
};

export default Navbar;
