import React from "react";

const AnimalGalleryCard = ({ animal }) => {
    return (
        <div className="card">
            <img src={animal.pictureUri} className="card-img-top" alt={animal.name} />
            <div className="card-body text-start">
                <h5 className="card-title">{animal.name}</h5>
                <p className="card-text"><strong>Type:</strong> {animal.type}</p>
                <p className="card-text"><strong>Breed:</strong> {animal.breed}</p>
                <p className="card-text"><strong>Age:</strong> {animal.age}</p>
                <p className="card-text"><strong>Gender:</strong> {animal.gender}</p>
                <p className="card-text">{animal.description}</p>
                <p className="card-text"><strong>Available:</strong> {animal.available ? "Yes" : "No"}</p>
            </div>
        </div>
    );
}

export default AnimalGalleryCard;