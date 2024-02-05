import React from "react";
import { useNavigate } from 'react-router-dom';

const AnimalHomecard = ({ animal, onClickAnimal }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClickAnimal) {
      onClickAnimal(animal);
    } else {
      navigate('/pet', { state: { pet: animal } });
    }
  };

  return (
    <div className="box" onClick={handleCardClick}>
      <div className="card">
        <img
          src={animal.pictureUri}
          className="card-img-top"
          alt={animal.name}
        />
        <div className="card-body">
          <h5 className="card-title">{animal.name}</h5>
          <p className="card-type">
            <strong>Type:</strong> {animal.type}
          </p>
          <p
            className={`card-availability ${
              animal.status === "Available" ? "available" : "not-available"
            }`}
          >
            <strong>Availability:</strong>{" "}
            {animal.status === "Available" ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <style jsx>{`
        card-body {
          background-color: white;
        }
        .box {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
        }
        .card {
          position: relative;
          width: 250px;
          height: 350px;
          background: white;
          color: black;
          border-radius: 3px;
          margin:  40px auto;
          box-shadow: 0 3px 10px #00000033;
        }

        @media only screen and (max-width: 768px) {
          .box {
            flex-direction: column;
          }

          .card {
            width: 100%;
            max-width: none;
          }
        }

        .card::before,
        .card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 3px;
          box-shadow: 0 3px 10px #00000033;
          transition: 0.5s;
          z-index: -1;
          transform-origin: center; /* Add this line */
        }

        .card:hover::after {
          transform: rotate(10deg);
        }

        .card:hover::before {
          transform: rotate(20deg);
        }

        .card-img-top {
          position: absolute;
          z-index: 1;
          background: white;
          transition: transform 0.5s ease;
          width: 100%;
          height: 100%;
          object-fit: fill;
          object-position: 80% 100%;
        }

        .card:hover .card-img-top {
          transform : translateY(-20%);
        }

        img {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .card-body {

          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          height: 100px;
        }

        h5 {
          margin-top: 1px;
          padding: 0;
          font-weight: 900;
          font-size: 20px;
          text-align: center;
          line-height: 1.15em;
        }

        .card-availability {
          font-weight: 400;
          font-size: 15px;
          color: green;
        }
      `}</style>
    </div>
  );
};

export default AnimalHomecard;
