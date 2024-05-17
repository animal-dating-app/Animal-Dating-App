import React, { useState, useRef } from "react";
import { auth } from "../firebaseConfig";
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail  } from 'firebase/auth';
 
const SignIn = ({ user }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetError, setResetError] = useState(false);
    const formRef = useRef(null);

    if (user) navigate("/");

    // Sign in user 
    const onLogin = (e) => {
        e.preventDefault();

        setEmailError(false);
        setPasswordError(false);
        setAuthError(false);

        if  (formRef.current && formRef.current.checkValidity()) {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setEmailError(false);
                setPasswordError(false);
                setAuthError(false);
                navigate("/")
            })
            .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                if (errorCode.includes("email") || errorCode.includes("not-found")) {
                    setEmailError(true);
                }
                if (errorCode.includes("password")) {
                    setPasswordError(true);
                }
                if (errorCode.includes("many")) {
                    setAuthError(true);
                }
            });
        }
        else{
            formRef.current && formRef.current.reportValidity();
        }
    }

    // Show reset password and reset variables 
    const handleForgotPassowrd = () => {
        setShowResetPassword(true);
        setEmail('');
        setPassword('');
        setEmailError(false);
        setPasswordError(false);
        setAuthError(false);
    };

    // Handles sending passord reset email
    const handlePasswordReset = () => {
        setResetError(false);
        sendPasswordResetEmail(auth, email)
        .then(() => {
            window.alert("Password reset email sent!");
            setShowResetPassword(false);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode.includes("email") || errorCode.includes("not-found")) {
                setResetError(true);
            }
        });
    };

    // Show sign in and reset variables 
    const handleBack = () => {
        setShowResetPassword(false);
        setEmail('');
        setPassword('');
        setResetError(false);
    };

    return (
        <div>  
            {showResetPassword === true && (
                <div>
                    <h1>Reset Password</h1>
                    <div className="alert w-25 alert-info" role="alert" style={{margin: "auto", marginBottom: "0.5rem"}}>
                        An email will be sent to you with instructions to reset your password
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                {resetError === true && (
                                    <div className="alert w-25 mx-auto alert-danger" role="alert">
                                        Invalid Email
                                    </div>   
                                )}
                            </div>
                        </div>
                        <form ref={formRef}> 
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="email-address">Email address</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input id="email-address" name="email" type="email" placeholder="Email address"                                                                                
                                        onChange={(e)=>setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-primary btn-block" 
                                        style={{marginBottom: "0.5rem", marginTop: "1.0rem", width: "190px"}} onClick={handlePasswordReset}>
                                        Send Email
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button type="button" className="btn btn-secondary btn-block" 
                                        style={{marginBottom: "0.5rem", width: "190px"}} onClick={handleBack}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>           
                </div>
            )}
            {showResetPassword === false && (
                <div>
                    <h1> Login </h1>                       
                    <div className="col-sm-12 mx-auto">
                        <form ref={formRef}> 
                            {emailError === true && passwordError === false && (
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
                                Invalid Email
                            </div>   
                            )}
                            {authError === true && (
                            <div className="alert alert-danger" role="alert">
                                Too Many Attempts
                            </div>   
                            )}                                       
                            <div>
                                <label htmlFor="email-address">Email address</label>
                                <br></br>
                                <input id="email-address" name="email" type="email" placeholder="Email address"                                                                                
                                    onChange={(e)=>setEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <br></br>
                                <input id="password" name="password" type="password" placeholder="Password"                                                                                                                                         
                                    onChange={(e)=>setPassword(e.target.value)} required/>
                            </div>
                            <br></br>                    
                            <div>
                                <button type="button" className="btn btn-primary btn-block" 
                                    style={{marginBottom: "0.5rem", width: "190px"}} onClick={onLogin}>Login
                                </button>
                            </div>                               
                        </form>
                    </div> 
                    <p style={{marginBottom: "0.25rem"}}>
                        No account yet? {' '}
                        <NavLink to="/sign-up">Sign up</NavLink>
                    </p>
                    <button type="button" className="btn btn-link" onClick={handleForgotPassowrd}>Forgot Password?</button>     
                </div>
            )}                                                                      
        </div>
    );
};
 
export default SignIn;