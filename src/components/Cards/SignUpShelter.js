import React, { useState } from "react";
import { auth, db } from "../../firebaseConfig";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from "firebase/firestore";

const SignUpShelter = () => {

    const navigate = useNavigate();
    
    const [newShelter, setNewShelter] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        password: ""
    });

    const handleNewUserChange = (e) => {
        setNewShelter({...newShelter, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault()
       
        // Create Firebase Auth account 
        await createUserWithEmailAndPassword(auth, newShelter.email, newShelter.password)
          .then(async (userCredential) => {
                const user = userCredential.user.uid;

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
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
          });
    }

    return (
        <div>
            <div className="col">
                <div>
                    <label htmlFor="email-address">Email address</label>
                    <br></br>
                    <input id="email-address" name="email" type="email" required placeholder="Email address"
                        onChange={handleNewUserChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <br></br>
                    <input id="password" name="password" type="password" required placeholder="Password"
                        onChange={handleNewUserChange}/>
                </div>
                <div>
                    <label htmlFor="name">Shelter Name</label>
                    <br></br>
                    <input id="name" name="name" type="name" required placeholder="Shelter Name"
                        onChange={handleNewUserChange}/>
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <br></br>
                    <input id="address" name="address" type="address" required placeholder="Address"
                        onChange={handleNewUserChange}/>
                </div>
                <div>
                    <label htmlFor="phone">Phone Number</label>
                    <br></br>
                    <input id="phone" name="phone" type="phone" required placeholder="Phone Number"
                        onChange={handleNewUserChange}/>
                </div>
                <br></br>
                <button type="submit" onClick={onSubmit}>Create Account</button>
                <br></br>
            </div>
        </div>
    );
};

export default SignUpShelter;