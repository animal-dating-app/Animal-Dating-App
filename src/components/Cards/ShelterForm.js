const ShelterForm = ({ currentUser, handleChange}) => { 

    return (
        <div className="col">
        <div>
            <label htmlFor="name"><strong>Shelter Name</strong></label>
            <br></br>
            <input id="name" name="name" value={currentUser.name || ''} required placeholder="Shelter Name"
                onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="address"><strong>Address</strong></label>
            <br></br>
            <input id="address" name="address" value={currentUser.address || ''} required placeholder="Address"
                onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="email-address"><strong>Contact Email</strong></label>
            <br></br>
            <input id="email-address" name="email" value={currentUser.email || ''} required placeholder="Email address"
                onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="phone"><strong>Phone Number</strong></label>
            <br></br>
            <input id="phone" name="phone" value={currentUser.phone || ''} required placeholder="Phone Number"
                onChange={handleChange}/>
        </div>
    </div>
    );
};

export default ShelterForm;