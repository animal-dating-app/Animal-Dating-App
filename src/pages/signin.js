import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
 
const SignIn = ({ user }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (user) navigate("/");

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            //const user = userCredential.user;
            navigate("/")
            //console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
    }

    return (
        <div>                                            
            <h1> Login </h1>                       
                                            
            <form>                                              
                <div>
                    <label htmlFor="email-address">
                        Email address
                    </label>
                    <br></br>
                    <input
                        id="email-address"
                        name="email"
                        type="email"                                    
                        required                                                                                
                        placeholder="Email address"
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <br></br>
                    <input
                        id="password"
                        name="password"
                        type="password"                                    
                        required                                                                                
                        placeholder="Password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                <br></br>                    
                <div>
                    <button                                    
                        onClick={onLogin}                                        
                    >      
                        Login                                                                  
                    </button>
                </div>                               
            </form>
            
            <p>
                No account yet? {' '}
                <NavLink to="/sign-up">
                    Sign up
                </NavLink>
            </p>
                                        
        </div>
    );
};
 
export default SignIn;