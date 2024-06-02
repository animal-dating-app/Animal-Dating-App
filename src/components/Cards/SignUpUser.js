import React, { useState, useRef } from "react";
import { auth, db } from "../../firebaseConfig";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from "firebase/firestore";
import emailjs from '@emailjs/browser';


const SignUpUser = ({ setEmailError, setPasswordError }) => {

    const form = useRef();
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
    const [preferences, setPreferences] = useState([]);
    const [familyDetails, setFamilyDetails] = useState([]);
    const [password, setPassword] = useState();

    const handleNewUserChange = (e) => {
        setNewUser({...newUser, [e.target.name]: e.target.value });
    };

    const handlePreferenceClick = (e) => { 
        const value = e.target.value;
        const pressed = e.target.ariaPressed;

        if (pressed === "true") {
            setPreferences([
                ...preferences, e.target.value                
            ]);
        }
        else {
            setPreferences(prev => prev.filter(preferences => preferences !== value))
        }
    };

    const handleDetailsClick = (e) => {
        const value = e.target.value;
        const pressed = e.target.ariaPressed;

        if (pressed === "true") {
            setFamilyDetails([
                ...familyDetails, e.target.value                
            ]);
        }
        else {
            setFamilyDetails(prev => prev.filter(familyDetails => familyDetails !== value))
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if  (form.current && form.current.checkValidity()) {
            
            // Send email to user using emailjs.com

            // Configure serviceID and templateID to send Email
            emailjs
            .sendForm('service_7wslv2f', 'template_92jc4dk', form.current, {
                publicKey: 'G8CzJ-OhJH7qfmi_C',
            })
            .then(
                () => {
                console.log('SUCCESS!');
                },
                (error) => {
                console.log('FAILED...', error.text);
                },
            );
            
            const newUserData = newUser;
            newUserData["preferences"] = preferences;
            newUserData["familyDetails"] = familyDetails;
            let user = null;
            setEmailError(false);
            setPasswordError(false);

            // Create Firebase Auth account 
            await createUserWithEmailAndPassword(auth, newUser.email, password)
                .then(async (userCredential) => {
                    user = userCredential.user.uid;
                    delete newUserData.email;
                    delete newUserData.password;
                    
                    // Add shelter info to database
                    await addDoc(collection(db, "users"), {
                        ...newUserData,
                        userId: user
                    })
                    .then(
                        navigate("/")
                    );
                })
            .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode.includes("email")) {
                        setEmailError(true);
                    }
                    if (errorCode.includes("password")) {
                        setPasswordError(true);
                    }
            });
        }
        else {
            form.current && form.current.reportValidity();
        }
    }

    return (
        <div>
                <form ref={form} onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email-address"><strong>Email</strong></label>
                        <br></br>
                        <input id="email-address" name="email" type="email" required placeholder="Email address"
                            onChange={handleNewUserChange}/>
                    </div>
                    <div>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <br></br>
                        <input id="password" name="password" type="password" required placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="firstName"><strong>First Name</strong></label>
                        <br></br>
                        <input id="firstName" name="firstName" type="firstName" required placeholder="First Name"
                            onChange={handleNewUserChange}/>
                    </div>
                    <div>
                        <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <br></br>
                        <input id="lastName" name="lastName" type="lastName" required placeholder="Last Name"
                            onChange={handleNewUserChange}/>
                    </div>
                </form>
                <div>
                    <p><strong>Preferences</strong></p>
                    <div className="row">
                        <div className="col">
                            <p className="d-inline-flex gap-1">
                            <button type="button" className="btn mb-0" data-bs-toggle="button" value="Dogs" onClick={handlePreferenceClick}>Dogs</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Cats" onClick={handlePreferenceClick}>Cats</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Rabbits" onClick={handlePreferenceClick}>Rabbits</button>
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className="d-inline-flex gap-1">
                            <button type="button" className="btn" data-bs-toggle="button" value="Hamster" onClick={handlePreferenceClick}>Hamster</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Bird" onClick={handlePreferenceClick}>Bird</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Fish" onClick={handlePreferenceClick}>Fish</button>
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className="d-inline-flex gap-1">
                            <button type="button" className="btn" data-bs-toggle="button" value="Turtle" onClick={handlePreferenceClick}>Turtle</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Snake" onClick={handlePreferenceClick}>Snake</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Lizard" onClick={handlePreferenceClick}>Lizard</button>
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className="d-inline-flex gap-1">
                            <button type="button" className="btn" data-bs-toggle="button" value="Other" onClick={handlePreferenceClick}>Other</button>
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <p><strong>Family Details</strong></p>
                    <div className="row">
                        <div className="col">
                            <p className="d-inline-flex gap-1">
                            <button type="button" className="btn mb-0" data-bs-toggle="button" value="Have Kids" onClick={handleDetailsClick}>Have Kids</button>
                            <button type="button" className="btn" data-bs-toggle="button" value="Have Pets" onClick={handleDetailsClick}>Have Other Pets</button>
                            </p>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-primary btn-block" onClick={onSubmit}>Create Account</button>
                <br></br>     
        </div>
    );
};

export default SignUpUser;