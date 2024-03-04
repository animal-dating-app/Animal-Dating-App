import React, { useState, useRef } from "react";
import { auth, db } from "../../firebaseConfig";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from "firebase/firestore";
import emailjs from '@emailjs/browser';


const SignUpShelter = ({ setEmailError, setPasswordError }) => {

    const form = useRef();
    const navigate = useNavigate();
    const [newShelter, setNewShelter] = useState({
        name: "",
        address: "",
        phone: "",
        email: ""
    });
    const [password, setPassword] = useState();
    const formRef = useRef(null);

    const handleNewUserChange = (e) => {
        setNewShelter({...newShelter, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault()

        setEmailError(false);
        setPasswordError(false);

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

        if  (formRef.current && formRef.current.checkValidity()) {
            // Create Firebase Auth account 
            await createUserWithEmailAndPassword(auth, newShelter.email, password)
            .then(async (userCredential) => {
                    const user = userCredential.user.uid;
                    delete newShelter.email;
                    delete newShelter.password;

                    // Add shelter info to database
                    await addDoc(collection(db, "shelters"), {
                        ...newShelter,
                        shelterId: user
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
            formRef.current && formRef.current.reportValidity();
        }
    }

    return (
        <div>
            <form ref={formRef}>
                <div className="col">
                    <form ref={form} onSubmit={onSubmit}>     
                        <div>
                            <label htmlFor="email-address"><strong>Email address</strong></label>
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
                            <label htmlFor="name"><strong>Shelter Name</strong></label>
                            <br></br>
                            <input id="name" name="name" type="name" required placeholder="Shelter Name"
                                onChange={handleNewUserChange}/>
                        </div>
                    </form>
                    <div>
                        <label htmlFor="address"><strong>Address</strong></label>
                        <br></br>
                        <input id="address" name="address" type="address" required placeholder="Address"
                            onChange={handleNewUserChange}/>
                    </div>
                    <div>
                        <label htmlFor="phone"><strong>Phone Number</strong></label>
                        <br></br>
                        <input id="phone" name="phone" type="phone" required placeholder="Phone Number"
                            onChange={handleNewUserChange}/>
                    </div>
                    <br></br>
                    <button type="submit" className="btn btn-primary btn-block" onClick={onSubmit}>Create Account</button>
                </div>
            </form>
        </div>
    );
};

export default SignUpShelter;