import React, { useState, useEffect } from "react";
import {
  dog,
  cat,
  rabbit,
  bird,
  hamster,
  turtle,
  snake,
  lizard,
  fish,
  other,
} from "../../assets/images";

const AnimalGalleryCard = ({
  animal,
  selectable,
  onSelectAnimal,
  onClickAnimal,
  selected,
  callToAction,
}) => {
  const [isSelected, setIsSelected] = useState(selected);
  const [animalImage, setAnimalImage] = useState("");

  const petsPath = window.location.pathname === "/pets" ? true : false;

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  const handleSelect = (e) => {
    setIsSelected(e.target.checked);
    onSelectAnimal(animal.id);
  };

  const handleCardClick = (e) => {
    if (e.target.type === "checkbox") return;
    if (onClickAnimal) onClickAnimal(animal);
  };

  useEffect(() => {
    const placeholderImages = {
      dog,
      cat,
      rabbit,
      bird,
      hamster,
      turtle,
      snake,
      lizard,
      fish,
      other,
    };

    let type = animal.type ? animal.type.toLowerCase() : "other";
    let placeholder = placeholderImages[type] || placeholderImages.other;
    setAnimalImage(animal.pictureUri ? animal.pictureUri : placeholder);
  }, [animal.type, animal.pictureUri, animalImage]);

  const cardClass = isSelected
    ? "card border border-3 rounded-3 border-primary w-100"
    : "card w-100";

  let statusColor = (function () {
    switch (animal.status) {
      case "Pending":
        return "rgba(255, 193, 7, 0.60)";
      case "Available":
        return "rgba(40, 167, 69, 0.60)";
      case "Adopted":
        return "rgba(40, 69, 167, 0.60)";
      default:
        return "rgba(40, 40, 40, 0.60)";
    }
  })();

  function badgeColor(disposition) {
    if (disposition.includes("Good") || disposition.includes("House trained"))
      return "text-bg-success";
    else if (
      disposition.includes("must be leashed") ||
      disposition.includes("Special needs")
    )
      return "text-bg-warning";
    else {
      return "text-bg-secondary";
    }
  }

  if (callToAction === undefined) callToAction = "Click to learn more!";

  return (
    <div
      className={cardClass}
      onClick={handleCardClick}
      style={onClickAnimal ? { cursor: "pointer" } : {}}
    >
      <div
        className="card-img-overlay d-flex"
        style={{
          alignItems: "flex-start",
          paddingTop: "0.5rem",
          paddingLeft: "0.5rem",
        }}
      >
        <div
          className={`text-white fw-semibold`}
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.8rem",
            backgroundColor: statusColor,
          }}
        >
          {animal.status}
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
      <img
        src={animalImage}
        className="card-img-top"
        alt={animal.name}
        style={{ width: "100%", height: "auto", maxHeight: "500px" }} // Img size/dimension, adjust as needed.
      />
      <div className="card-body text-start">
        {animal.name && <h5 className="card-title">{animal.name}</h5>}
        {animal.breed && (
          <p className="card-text mb-0">
            <strong>Breed:</strong> {animal.breed}
          </p>
        )}
        {animal.age && (
          <p className="card-text mb-0">
            <strong>Age:</strong> {animal.age}
          </p>
        )}
        {animal.gender && (
          <p className="card-text mb-0">
            <strong>Gender:</strong> {animal.gender}
          </p>
        )}
        {animal.dateCreated && (
          <p className="card-text">
            <strong>Date Created:</strong> {animal.dateCreated}
          </p>
        )}
        <p className="card-text mb-1">{animal.description}</p>

        {animal.disposition && (
          <div>
            {animal.disposition.map((disposition, index) => (
              <span
                key={index}
                className={badgeColor(disposition) + ` me-1 badge`}
              >
                {disposition}
              </span>
            ))}
          </div>
        )}

        {callToAction && (
          <>
            <br></br>
            <strong>{callToAction}</strong>
          </>
        )}
      </div>
      {petsPath && (
        <style jsx>{`
          .card:hover {
            transform: scale(1.05);
            z-index: 10;
          }
        `}</style>
      )}
    </div>
  );
};

export default AnimalGalleryCard;
