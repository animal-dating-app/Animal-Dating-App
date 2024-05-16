const AdoptForm = ({ currentUser, handleChange, isAdmin}) => { 

    const activeClass = "btn active";
    const inactiveClass = "btn";

    return (
        <div className="col">
            <div>
                <label htmlFor="firstName" className="form-label"><strong>First Name</strong></label>
                <br></br>
                <input id="firstName" name="firstName" className="form-control mb-2" type="firstName" required 
                    placeholder="First Name" value={currentUser.firstName || ''} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="lastName" className="form-label"><strong>Last Name</strong></label>
                <br></br>
                <input id="lastName" name="lastName" className="form-control mb-2" type="lastName" required 
                    placeholder="Last Name" value={currentUser.lastName || ''} onChange={handleChange}/>
            </div>
            <div>
                
                <label htmlFor="preferences" className="form-label"><strong>Preferences</strong></label>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Dogs') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Dogs" name="preferences" onClick={handleChange}>Dogs</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Cats') ? activeClass: inactiveClass} 
                            data-bs-toggle="button" value="Cats" name="preferences" onClick={handleChange}>Cats</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Rabbits') ? activeClass: inactiveClass} 
                            data-bs-toggle="button" value="Rabbits" name="preferences" onClick={handleChange} checked>Rabbits</button>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Hamster') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Hamster" name="preferences" onClick={handleChange}>Hamster</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Bird') ? activeClass: inactiveClass}  
                        data-bs-toggle="button" value="Bird" name="preferences" onClick={handleChange}>Bird</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Fish') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Fish" name="preferences" onClick={handleChange}>Fish</button>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Turtle') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Turtle" name="preferences" onClick={handleChange}>Turtle</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Snake') ? activeClass: inactiveClass} 
                        data-bs-toggle="button" value="Snake" name="preferences" onClick={handleChange}>Snake</button>
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Lizard') ? activeClass: inactiveClass}  
                        data-bs-toggle="button" value="Lizard" name="preferences" onClick={handleChange}>Lizard</button>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="d-inline-flex gap-1">
                        <button type="button" className={currentUser.preferences && currentUser.preferences.includes('Other') ? activeClass: inactiveClass}  
                        data-bs-toggle="button" value="Other" name="preferences" onClick={handleChange}>Other</button>
                        </p>
                    </div>
                </div>
                {isAdmin && (
                    <>

                        {currentUser.favorites && currentUser.favorites.length > 0 && (
                            <div>
                                <label htmlFor="favorites" className="form-label"><strong>Favorite Animals</strong></label>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{fontSize:"16px"}}>Animal ID</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUser.favorites.map((favorite, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <p>{favorite}</p>
                                                </td>
                                                <td>
                                                    <button type="button" name="favDelBtn" className="btn btn-danger" 
                                                        value={favorite} onClick={handleChange}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        )}
                        {currentUser.dismissedPets && currentUser.dismissedPets.length > 0 && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Animal ID</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUser.dismissedPets.map((pet, index) => (
                                        <tr key={index}>
                                            <td>
                                                <p>{pet}</p>
                                            </td>
                                            <td>
                                                <button type="button" name="disDelBtn" className="btn btn-danger" 
                                                    value={pet} onClick={handleChange}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                    
                )}
            </div>
        </div>
    );
};

export default AdoptForm;