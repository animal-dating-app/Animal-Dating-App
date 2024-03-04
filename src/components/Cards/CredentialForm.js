const CredentialForm = ({ email, setEmail, newPassword, setNewPassword, confirmedPassword, setConfirmedPassword, passwordError, mismatch}) => { 

    return (
        <div>
            {passwordError === true && (
                <div className="alert alert-danger" role="alert">
                    Invalid Password
                </div>   
            )}
            {mismatch === true && (
                <div className="alert alert-danger" role="alert">
                    Passwords do not match
                </div>   
            )}
            <div>
                <label htmlFor="email-address">New Email address</label>
                <br></br>
                <input id="email-address" name="email" type="email" placeholder="Email" value={email}                                                                                
                    onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">New Password</label>
                <br></br>
                <input id="password" name="password" type="password" placeholder="Password" value={newPassword}                                                                                                                                        
                    onChange={(e)=>setNewPassword(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <br></br>
                <input id="passwordConfirm" name="passwordConfirm" type="password" placeholder="Password" 
                    value={confirmedPassword} onChange={(e)=>setConfirmedPassword(e.target.value)}/>
            </div>
            <br></br> 
        </div>
    )
}

export default CredentialForm;