import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
 
const SignUp = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            navigate("/")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => user && navigate("/"));
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div>
            <section>
            <div>
                <div>                  
                    <h1> Create Account</h1>
                    <br></br>                                                                            
                    <form>                                                                                            
                        <div>
                            <label htmlFor="email-address">
                                Email Address
                            </label>
                            <br></br>
                            <input
                                type="email"
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email Address"                                
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <br></br>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"              
                            />
                        </div>                                             
                        <br></br>
                        <button
                            type="submit" 
                            onClick={onSubmit}                        
                        >  
                            Create Account                               
                        </button>
                                                                     
                    </form>
                   
                    <p>
                        Already have an account?{' '}
                        <NavLink to="/sign-in" >
                            Sign in
                        </NavLink>
                    </p>                   
                </div>
            </div>
        </section>
        </div>
    );
};
 
export default SignUp;