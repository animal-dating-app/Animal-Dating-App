import React from "react";

const AnimalHomecard = ({ animal }) => {
  return (
    <div className="card">
      <div id={`carousel-${animal.id}`} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={animal.pictureUri} className="d-block w-100" alt={animal.name} />
          </div>
          {/* Additional carousel items can be added for multiple images */}
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{animal.name}</h5>
        <p className="card-type"><strong>Type:</strong> {animal.type}</p>
        <p className={`card-availability ${animal.available ? "available" : "not-available"}`}>
          <strong>Availability:</strong> {animal.available ? "Yes" : "No"}
        </p>
      </div>

      {/* Add your own styling or classNames as needed */}
      <style>{`
        .card {
          background-color: #f8f9fa;
          border: 1px solid rgba(0, 0, 0, 0.125);
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s ease-in-out;
          width: 80%;
          margin: auto;
        }

        .card:hover {
          transform: scale(1.05);
        }

        .carousel {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        .card-body {
          padding: 20px;
        }

        .card-title {
          font-size: 1.5em;
          margin-bottom: 10px;
        }

        .card-type,
        .card-breed,
        .card-age,
        .card-gender {
          margin: 5px 0;
        }

        .card-description {
          margin-bottom: 15px;
        }

        .card-availability {
          font-weight: bold;
          color: #007bff;
        }

        .available {
          color: #28a745;
        }

        .not-available {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}

export default AnimalHomecard;
