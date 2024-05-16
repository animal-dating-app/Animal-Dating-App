const AdminAnimalForm = ({ currentUser, handleChange}) => { 

    return (
        <div className="col">
        <div>
            <label htmlFor="name"><strong>Shelter Name</strong></label>
            <br></br>
            <input id="name" name="name" value={currentUser.name || ''} required placeholder="Shelter Name"
                onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="type"><strong>Type</strong></label>
            <br></br>
            <input id="type" name="type" value={currentUser.type || ''} required placeholder="Address"
                onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="breed"><strong>Breed</strong></label>
            <br></br>
            <input id="breed" name="breed" value={currentUser.breed || ''} required placeholder="Breed"
                onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="gender"><strong>Gender</strong></label>
            <br></br>
            <input id="gender" name="gender" value={currentUser.gender || ''} required placeholder="Gender"
                onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="age"><strong>Age</strong></label>
            <br></br>
            <input id="age" name="age" value={currentUser.age || ''} required placeholder="Age"
                onChange={handleChange}/>
        </div>

        {/* Option to change ShelterID?  */}

        <div>
            <label htmlFor="status"><strong>Status</strong></label>
            <br></br>
            <input id="status" name="status" value={currentUser.status || ''} required placeholder="Status"
                onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="disposition"><strong>Disposition</strong></label>
            <br></br>
            <input id="disposition" name="disposition" value={currentUser.disposition || ''} required placeholder="Disposition"
                onChange={handleChange}/>
        </div>

    </div>
    );
};

export default AdminAnimalForm;