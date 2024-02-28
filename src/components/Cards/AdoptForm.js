const AdoptForm = ({ currentUser, handleChange}) => { 

    const activeClass = "btn active";
    const inactiveClass = "btn";

    const handlePreferenceClick = (e) => { 
        const value = e.target.value;
        const pressed = e.target.ariaPressed;

        if (pressed === "true") {
            currentUser.preferences.push(value);
        }
        else {
            const index = currentUser.preferences.indexOf(value);
            if (index > -1) {
                currentUser.preferences.splice(index, 1);
            }
        }
    };

    return (
        <div className="col">
            <div>
            <label htmlFor="email-address"><strong>Email address</strong></label>
                <br></br>
                <input id="email-address" name="email" type="email" required placeholder="Email address"
                    value={currentUser.email || ''} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="firstName"><strong>First Name</strong></label>
                <br></br>
                <input id="firstName" name="firstName" type="firstName" required placeholder="First Name"
                    value={currentUser.firstName || ''} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="lastName"><strong>Last Name</strong></label>
                <br></br>
                <input id="lastName" name="lastName" type="lastName" required placeholder="Last Name"
                    value={currentUser.lastName || ''} onChange={handleChange}/>
            </div>
            <div>
                <p><strong>Preferences</strong></p>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Dogs') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Dogs" onClick={handlePreferenceClick}>Dogs</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Cats') ? activeClass: inactiveClass} 
                            data-bs-toggle="button" value="Cats" onClick={handlePreferenceClick}>Cats</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Rabbits') ? activeClass: inactiveClass} 
                            data-bs-toggle="button" value="Rabbits" onClick={handlePreferenceClick} checked>Rabbits</button>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Hamster') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Hamster" onClick={handlePreferenceClick}>Hamster</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Bird') ? activeClass: inactiveClass}  
                        data-bs-toggle="button" value="Bird" onClick={handlePreferenceClick}>Bird</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Fish') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Fish" onClick={handlePreferenceClick}>Fish</button>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Turtle') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Turtle" onClick={handlePreferenceClick}>Turtle</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Snake') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Snake" onClick={handlePreferenceClick}>Snake</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Lizard') ? activeClass: inactiveClass}  
                        data-bs-toggle="button" value="Lizard" onClick={handlePreferenceClick}>Lizard</button>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Other') ? activeClass: inactiveClass}  
                        data-bs-toggle="button" value="Other" onClick={handlePreferenceClick}>Other</button>
                        </p>
                    </div>
                </div>
            </div>
            <br></br>
        </div>
    );
};

export default AdoptForm;