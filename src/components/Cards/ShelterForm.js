import ImageUploader from "./Imageupload";

const ShelterForm = ({ currentUser, setCurrentUser, handleChange}) => { 

    const handleImageUpload = (url) => {
            let prevImages = currentUser.headerImages || [];
            let newImages = [...prevImages];
            newImages.push(url[0]);
            setCurrentUser({ ...currentUser, headerImages: newImages });
      };

    return (
        <div className="col">
            <div>
                <label htmlFor="name" className="form-label"><strong>Shelter Name</strong></label>
                <br></br>
                <input id="name" name="name" className="form-control mb-2" value={currentUser.name || ''} required 
                    placeholder="Shelter Name" onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="address" className="form-label"><strong>Address</strong></label>
                <br></br>
                <input id="address" name="address" className="form-control mb-2" value={currentUser.address || ''} required 
                    placeholder="Address" onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="email-address" className="form-label"><strong>Contact Email</strong></label>
                <br></br>
                <input id="email-address" name="email" className="form-control mb-2" value={currentUser.email || ''} 
                placeholder="Email address" onChange={handleChange}/>
            </div>

            <div>
                <label htmlFor="phone" className="form-label"><strong>Phone Number</strong></label>
                <br></br>
                <input id="phone" name="phone" className="form-control mb-2" value={currentUser.phone || ''} required 
                placeholder="Phone Number" onChange={handleChange}/>
            </div>

            <div>
                <label htmlFor="description" className="form-label"><strong>Description</strong></label>
                <br></br>
                <textarea id="description" name="description" className="form-control mb-2" value={currentUser.description || ''} 
                    onChange={handleChange} style={{width:"100%"}}></textarea>
            </div>
            {/* Show list of existing images with delete buttons */}
            <label htmlFor="images" className="form-label">
                Header Images
            </label>
            { currentUser.headerImages && currentUser.headerImages.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUser.headerImages.map((image, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={image} alt="header" style={{width: "128px"}} />
                                </td>
                                <td>
                                    <button type="button" name="imgDelBtn" className="btn btn-danger" 
                                        value={image} onClick={handleChange}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Add new images */}
            <ImageUploader
                onImageUpload={handleImageUpload}
                name="pictureUri"
            />  
        </div>
    );
};

export default ShelterForm;