import React, { useState, useEffect } from "react";
import placeholderImage from "../../assets/placeholder.png";

const AnimalGalleryCard = ({ animal, selectable, onSelectAnimal, selected }) => {
    const [isSelected, setIsSelected] = useState(selected);

    useEffect(() => {
        setIsSelected(selected);
    }, [selected]);

    const handleSelect = (e) => {
        setIsSelected(e.target.checked);
        onSelectAnimal(animal.id);
    };

    const cardClass = isSelected ? "card border border-3 border-primary w-100" : "card w-100";

    const image = animal.pictureUri ? animal.pictureUri : placeholderImage;

    return (
        <div className={cardClass}>
            {selectable && (
                <div className="card-img-overlay d-flex justify-content-end">
                    <input 
                        type="checkbox" 
                        className="form-check-input mt-2 me-2" 
                        checked={isSelected}
                        onChange={handleSelect} 
                    />
                </div>
            )}
            <img src={image} className="card-img-top" alt={animal.name} />
            <div className="card-body text-start">
                {animal.name && <h5 className="card-title">{animal.name}</h5> }
                {animal.type && <p className="card-text"><strong>Type:</strong> {animal.type}</p> }
                {animal.breed && <p className="card-text"><strong>Breed:</strong> {animal.breed}</p> }
                {animal.age && <p className="card-text"><strong>Age:</strong> {animal.age}</p> }
                {animal.gender && <p className="card-text"><strong>Gender:</strong> {animal.gender}</p> }
                {animal.description && <p className="card-text">{animal.description}</p> }
                <p className="card-text"><strong>Available:</strong> {animal.available ? "Yes" : "No"}</p>
            </div>
        </div>
    );
}

export default AnimalGalleryCard;