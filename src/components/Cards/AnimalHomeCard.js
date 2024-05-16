// import React from "react";
// import { useNavigate } from 'react-router-dom';

// const AnimalHomecard = ({ animal, onClickAnimal }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     if (onClickAnimal) {
//       onClickAnimal(animal);
//     } else {
//       navigate('/pet', { state: { pet: animal } });
//     }
//   };

//   return (
//     <div className="box-carousel" onClick={handleCardClick}>
//       <div className={"card-carousel"}>
//         <div className="img-container">
//         <img 
//           src={animal.pictureUri}
//           className="card-img-top"
//           alt={animal.name}
//         />
//          </div>
//         <div className="card-body text-start z-3">
          
//           <h5 className="card-title">{animal.name}</h5>
//           {/* <p className="card-type">
//             <strong>Type:</strong> {animal.type}
//           </p> */}
//           <p
//             className={`text-white fw-semibold ${
//               animal.status === "Available" ? "available" : "not-available"
//             }`}
//           >
//             <strong>Availability:</strong>{" "}
//             {animal.status === "Available" ? "Yes" : "No"}
//           </p>

//           <p className="card-text mb-0">
// 						<strong>Breed:</strong> {animal.breed}
// 					</p>

//           <p 
//           className="card-text mn-0"> <strong>Age:</strong> {animal.age}
//           </p>

//           <p 
//           className="card-text mb-0"> <strong>Gender :</strong> {animal.gender}
//           </p>

//           <p 
//           className="card-text"> <strong>Date Created :</strong> {animal.dateCreated}
//           </p>

//           <p 
//           className="card-text mb-1"> {animal.description}
//           </p>
//         </div>
//       </div>

//       <style>{`
//         card-body-carousel {
//           background-color: white;
//         }
//         .box-carousel {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 32px;
//         }
//         .card-carousel {
//           position: relative;
//           width: 250px;
//           height: 350px;
//           background: white;
//           color: black;
//           border-radius: 3px;
//           margin:  40px auto;
//           box-shadow: 0 3px 10px #00000033;
//         }

//         @media only screen and (max-width: 768px) {
//           .box-carousel {
//             flex-direction: column;
//           }

//           .card-carousel {
//             width: 100%;
//             max-width: none;
//           }
//         }
//         .card-carousel:hover {
//           transform: scale(1.05);
//           z-index: 10;
//         }
//         .image-container {
//           max-width: 300px; /* Adjust the width as needed */
//           max-height: 300px;
//         }
       
//       `}</style>
//     </div>
//   );
// };

// export default AnimalHomecard;
