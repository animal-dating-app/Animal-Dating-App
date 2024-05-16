import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import SignUpUser from "../components/Cards/SignUpUser";
import SignUpShelter from "../components/Cards/SignUpShelter";
 
const SignUp = ({ user }) => {

    const navigate = useNavigate();
    const [isShelter, setIsShelter] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    if (user) navigate("/");
    
    const handleRadioChange = (e) => {
        const value = e.target.id;
        setEmailError(false);
        setPasswordError(false);
        if (value === "shelter") {
            setIsShelter(true);
        }
        else {
            setIsShelter(false);
        }
    }

    return (
        <div>                      
            <h1> Create Account</h1>
            <div className="col-sm-12 mx-auto"> 
                {emailError === true && passwordError === false &&(
                    <div className="alert alert-danger" role="alert">
                        Invalid Email
                    </div>   
                )}
                {passwordError === true && emailError === false && (
                    <div className="alert alert-danger" role="alert">
                        Invalid Password
                    </div>   
                )}
                {passwordError === true && emailError === true && (
                    <div className="alert alert-danger" role="alert">
                        Invalid Email & Password
                    </div>   
                )}   
                          
                <div>
                    <input type="radio" className="btn-check m-2" name="options-base" id="adopt" autoComplete="off" defaultChecked onClick={handleRadioChange}/>
                    <label className="btn m-2" htmlFor="adopt">Adopt</label>
                    <input type="radio" className="btn-check m-2" name="options-base" id="shelter" autoComplete="off" onClick={handleRadioChange} />
                    <label className="btn m-2" htmlFor="shelter">Shelter</label>
                </div>
                {isShelter && (
                    <SignUpShelter setEmailError={setEmailError} setPasswordError={setPasswordError} />
                )}
                {!isShelter && (
                    <SignUpUser setEmailError={setEmailError} setPasswordError={setPasswordError} />
                )}
                <p style={{marginBottom: "0.25rem", marginTop: "0.25rem"}}>Already have an account?{' '}
                    <NavLink to="/sign-in" >Sign in</NavLink>
                </p>                                           
                 
            </div>
        </div>
    );
};
 
export default SignUp;