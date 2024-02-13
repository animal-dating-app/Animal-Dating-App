import React from "react";

const AnimalCard = ({ animal }) => {

    let statusColor = (function () {
        switch (animal.status) {
            case "Pending":
                return 'rgba(255, 193, 7, 0.60)';
            case "Available":
                return 'rgba(40, 167, 69, 0.60)';
            case "Adopted":
                return 'rgba(40, 69, 167, 0.60)';
            default:
                return 'rgba(40, 40, 40, 0.60)';
        }
    })();

    function badgeColor(disposition) {
        if (disposition.includes("Good") || disposition.includes("House trained")) return "text-bg-success";
        else if (disposition.includes("must be leashed") || disposition.includes("Special needs")) return "text-bg-warning";
        else { return "text-bg-secondary"; }
    }

    return (
    <div>
        <div className="container-fluid">        
            <div className="card">
                <div className="card-img-overlay d-flex" style={{ alignItems: 'flex-start', paddingTop: '0.5rem', paddingLeft: '0.5rem' }}>
                    <div className={`text-white fw-semibold`} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', backgroundColor: statusColor }}>
                        {animal.status}
                    </div>
                </div>
                <img src={animal.pictureUri} className="card-img-top" alt={animal.name} />
                
                <div className="card-body text-start">
                    {animal.name && <h2 class="card-title">{animal.name}</h2> }
                    <hr></hr>
                    {animal.breed && <p className="card-text"><strong>Breed:</strong> {animal.breed}</p> }
                    {animal.age && <p className="card-text"><strong>Age:</strong> {animal.age}</p> }
                    {animal.gender && <p className="card-text"><strong>Gender:</strong> {animal.gender}</p> }
                    {animal.dateCreated && <p className="card-text"><strong>Date Created:</strong> {animal.dateCreated}</p> }
                    <p className="card-text"><strong>Shelter:</strong> Seattle Animal Shelter</p>
                    {animal.description && <p className="card-text">{animal.description}</p> }
                    {animal.disposition &&
                        <div>
                            {animal.disposition.map((disposition, index) => (
                                <span key={index} className={ badgeColor(disposition) + ` me-1 badge` }>{disposition}</span>
                            )) }
                        </div>
                    }
                </div>
            </div>   
        </div>
    </div>   
    );
}

export default AnimalCard;