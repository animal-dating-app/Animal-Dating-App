import React from 'react';
import { AnimalGalleryCard } from ".";

const AnimalForm = ({ formRef, handleAnimalChange, animal}) => {
    return (
        <div className="row">
            <div className="col-lg-6 mb-4 text-start">
                <form ref={formRef}>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control mb-2" id="name" placeholder="Name" name="name" value={animal.name} onChange={handleAnimalChange} required />
                    
                    <label htmlFor="type" className="form-label text-start">Type</label>
                    <select className="form-select mb-2" id="type" name="type" value={animal.type} onChange={handleAnimalChange} required>
                        <option value="">Select Type</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Bird">Bird</option>
                        <option value="Fish">Fish</option>
                        <option value="Turtle">Turtle</option>
                        <option value="Snake">Snake</option>
                        <option value="Lizard">Lizard</option>
                        <option value="Other">Other</option>
                    </select>
                    
                    <label htmlFor="breed" className="form-label">Breed</label>
                    <input type="text" className="form-control mb-2" id="breed" placeholder="Breed" name="breed" value={animal.breed} onChange={handleAnimalChange} />

                    <label htmlFor="age" className="form-label text-start">Age</label>
                    <select className="form-select mb-2" id="age" name="age" value={animal.age} onChange={handleAnimalChange} required>
                        <option value="">Select Age</option>
                        { animal.type === "Cat" && <option value="Kitten">Kitten</option> }
                        { animal.type === "Dog" && <option value="Puppy">Puppy</option> }
                        { animal.type !== "Dog" && animal.type !== "Cat" && <option value="Baby">Baby</option> }
                        <option value="Young">Young</option>
                        <option value="Adult">Adult</option>
                        <option value="Senior">Senior</option>
                    </select>

                    <label htmlFor="gender" className="form-label text-start">Gender</label>
                    <select className="form-select mb-2" id="gender" name="gender" value={animal.gender} onChange={handleAnimalChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control mb-2" id="description" placeholder="Description" name="description" value={animal.description} onChange={handleAnimalChange}></textarea>

                    <label htmlFor="pictureUri" className="form-label text-start">Image URL</label>
                    <input type="url" className="form-control mb-2" id="pictureUri" placeholder="Image URL" name="pictureUri" value={animal.pictureUri} onChange={handleAnimalChange} pattern="https?://.+" />

                    <label htmlFor="availability" className="form-label">Status</label>
                    <select className="form-select mb-2" id="availability" name="availability" value={animal.pendingAdoption === true ? "pending" : animal.available} onChange={handleAnimalChange} required>
                        <option value="true">Available</option>
                        <option value="pending">Pending</option>
                        <option value="false">Not Available</option>
                    </select>
                </form>
            </div>
            <div className="col-lg-6 mt-lg-0 mt-4">
                <div>
                    <AnimalGalleryCard animal={animal} selectable={false} />
                </div>
            </div>
        </div>
    );
};

export default AnimalForm;