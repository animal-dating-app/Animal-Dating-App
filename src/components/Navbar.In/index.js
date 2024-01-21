import React from "react";
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

    let button;
    const navigate = useNavigate();

    // Log user out
    const handleLogout = () => {               
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    // Get user from auth 
    const user = auth.currentUser;

    // Check for user to update sign in /sign out button
    if (user) {
        console.log("User logged in")
        button = <NavBtnLink onClick={ handleLogout }>Sign Out</NavBtnLink>
    }   
    else {
        console.log("No user")
        button = <NavBtnLink to="/sign-in">Sign In</NavBtnLink>
    }

    return (
        <>
            <Nav>
                <Bars />
 
                <NavMenu>
                    <NavLink to="/" >
                        Home
                    </NavLink>
                    <NavLink to="/pets" >
                        Pets
                    </NavLink>
                    { user && 
                    <NavLink to="/dashboard" >
                        Dashboard
                    </NavLink>
                    }
                    { !user && 
                    <NavLink to="/sign-up" activeStyle>
                        Sign Up
                    </NavLink>
                    }
                    {/* Second Nav */}
                    {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
                </NavMenu>
                <NavBtn>
                    {button}
                </NavBtn>
            </Nav>
        </>
    );
};
 
export default Navbar;