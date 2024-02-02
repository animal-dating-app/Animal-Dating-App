import React, { useState } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
    PetsDropdownMenu,
    DropdownContainer
} from "./NavbarElements";
import { auth } from "../../firebaseConfig";
import {  signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
    const [isActive, setIsActive] = useState(false); 
    let button;
    const navigate = useNavigate();

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
                <DropdownContainer> 
                        <NavLink to="/pets" onClick={() => setIsActive(false)}>
                            Pets
                        </NavLink>
                        <PetsDropdownMenu>
                            <NavLink to="/pets/cats" onClick={() => setIsActive(false)}>Cats</NavLink>
                            <NavLink to="/pets/dogs" onClick={() => setIsActive(false)}>Dogs</NavLink>
                            <NavLink to="/pets/others" onClick={() => setIsActive(false)}>Others</NavLink>
                        </PetsDropdownMenu>
                    </DropdownContainer>
                        <PetsDropdownMenu>
                            <NavLink to="/pets/cats" onClick={() => setIsActive(false)}>Cats</NavLink>
                            <NavLink to="/pets/dogs" onClick={() => setIsActive(false)}>Dogs</NavLink>
                            <NavLink to="/pets/others" onClick={() => setIsActive(false)}>Others</NavLink>
                        </PetsDropdownMenu>
                    {user && (
                        <NavLink to="/dashboard" onClick={() => setIsActive(false)}>
                            Dashboard
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