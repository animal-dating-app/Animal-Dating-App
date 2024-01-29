import React, { useState } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";
import { auth } from "../../firebaseConfig";
import {  signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
 
 
const Navbar = () => {
    const [isActive, setIsActive] = useState(false); 
    let button;
    const navigate = useNavigate();

    // Log user out
    const handleLogout = () => {               
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            //console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    // Get user from auth 
    const user = auth.currentUser;

    // Check for user to update sign in /sign out button
    if (user) {
        //console.log("User logged in")
        button = <NavBtnLink onClick={ handleLogout }>Sign Out</NavBtnLink>
    }   
    else {
        //console.log("No user")
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
                    {user && (
                        <NavLink to="/dashboard" onClick={() => setIsActive(false)}>
                            Dashboard
                        </NavLink>
                    )}
                    {!user && (
                        <NavLink to="/sign-up" onClick={() => setIsActive(false)} activeStyle>
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