import React, { useState, useEffect } from "react";
import dog from "../../assets/images/dog.png";
import cat from "../../assets/images/cat.png";
import rabbit from "../../assets/images/rabbit.png";
import bird from "../../assets/images/bird.png";
import hamster from "../../assets/images/hamster.png";
import turtle from "../../assets/images/turtle.png";
import snake from "../../assets/images/snake.png";
import lizard from "../../assets/images/lizard.png";
import fish from "../../assets/images/fish.png";
import other from "../../assets/images/other.png";

const AnimalGalleryCard = ({ animal, selectable, onSelectAnimal, selected }) => {
    const [isSelected, setIsSelected] = useState(selected);
    const [animalImage, setAnimalImage] = useState("");

    useEffect(() => {
        setIsSelected(selected);
    }, [selected]);

    const handleSelect = (e) => {
        setIsSelected(e.target.checked);
        onSelectAnimal(animal.id);
    };

    useEffect(() => {
        setAnimalImage(animal.pictureUri ? animal.pictureUri : getPlaceholderImage(animal.type));

        console.log(getPlaceholderImage(animal.type))

        console.log(animalImage)
    }, [animal.type, animal.pictureUri, animalImage]);

    const cardClass = isSelected ? "card border border-3 rounded-3 border-primary w-100" : "card w-100";

    function getPlaceholderImage(type) {
        switch (type) {
            case "Dog":
                return dog;
            case "Cat":
                return cat;
            case "Rabbit":
                return rabbit;
            case "Bird":
                return bird;
            case "Hamster":
                return hamster;
            case "Turtle":
                return turtle;
            case "Snake":
                return snake;
            case "Lizard":
                return lizard;
            case "Fish":
                return fish;
            default:
                return other;
        }
    }

    let statusColor, statusText, textColor;
    if (animal.pendingAdoption) {
        statusColor = 'bg-warning';
        statusText = 'Pending';
        textColor = 'text-dark';
    } else if (animal.available) {
        statusColor = 'bg-success';
        statusText = 'Available';
        textColor = 'text-white';
    } else {
        statusColor = 'bg-secondary';
        statusText = 'Not Available';
        textColor = 'text-white';
    }


    return (
        <div className={cardClass}>
            
            <div className="card-img-overlay d-flex" style={{ alignItems: 'flex-start', paddingTop: '0.5rem', paddingLeft: '0.5rem' }}>
                <div className={`${textColor} ${statusColor}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem' }}>
                    {statusText}
                </div>
            </div>
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
            <img src={animalImage} className="card-img-top" alt={animal.name} />
            <div className="card-body text-start">
                {animal.name && <h5 className="card-title">{animal.name}</h5> }
                {animal.type && <p className="card-text"><strong>Type:</strong> {animal.type}</p> }
                {animal.breed && <p className="card-text"><strong>Breed:</strong> {animal.breed}</p> }
                {animal.age && <p className="card-text"><strong>Age:</strong> {animal.age}</p> }
                {animal.gender && <p className="card-text"><strong>Gender:</strong> {animal.gender}</p> }
                {animal.description && <p className="card-text">{animal.description}</p> }
            </div>
        </div>
    );
}

export default AnimalGalleryCard;