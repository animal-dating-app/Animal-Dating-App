import React from "react";

const AnimalCard = ({ animal }) => {

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
    <div>
        <div className="container-fluid">        
            <div className="card">
                <div className="card-img-overlay d-flex" style={{ alignItems: 'flex-start', paddingTop: '0.5rem', paddingLeft: '0.5rem' }}>
                    <div className={`${textColor} ${statusColor}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem' }}>
                        {statusText}
                    </div>
                </div>
                <img src={animal.pictureUri} className="card-img-top" alt={animal.name} />
                
                <div className="card-body text-start">
                    {animal.name && <h2 class="card-title">{animal.name}</h2> }
                    <hr></hr>
                    {animal.breed && <p className="card-text"><strong>Breed:</strong> {animal.breed}</p> }
                    {animal.age && <p className="card-text"><strong>Age:</strong> {animal.age}</p> }
                    {animal.gender && <p className="card-text"><strong>Gender:</strong> {animal.gender}</p> }
                    <p className="card-text"><strong>Shelter:</strong> Seattle Animal Shelter</p>
                    {animal.description && <p className="card-text">{animal.description}</p> }
                </div>
            </div>   
        </div>
    </div>   
    );
}

export default AnimalCard;