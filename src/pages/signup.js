import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import SignUpUser from "../components/Cards/SignUpUser";
import SignUpShelter from "../components/Cards/SignUpShelter";
 
const SignUp = ({ user }) => {

    const navigate = useNavigate();
    const [isShelter, setIsShelter] = useState(false);

    if (user) navigate("/");
    
    const handleRadioChange = (e) => {
        const value = e.target.id;
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
            <form>             
                <div>
                    <input type="radio" className="btn-check m-2" name="options-base" id="adopt" autoComplete="off" defaultChecked onClick={handleRadioChange}/>
                    <label className="btn m-2" htmlFor="adopt">Adopt</label>
                    <input type="radio" className="btn-check m-2" name="options-base" id="shelter" autoComplete="off" onClick={handleRadioChange} />
                    <label className="btn m-2" htmlFor="shelter">Shelter</label>
                </div>
                {isShelter && (
                    <SignUpShelter />
                )}
                {!isShelter && (
                    <SignUpUser />
                )}
                <p>Already have an account?{' '}<NavLink to="/sign-in" >Sign in</NavLink></p>                                           
            </form> 
        </div>
    );
};
 
export default SignUp;