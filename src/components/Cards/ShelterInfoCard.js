import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { auth } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';

function ShelterInfoCard({ shelter }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    // Function to start or reset the image rotation timer
    const startRotationTimer = () => {
        if (shelter.headerImages && shelter.headerImages.length > 1) {
            return setInterval(() => {
                setCurrentImageIndex(prevIndex => prevIndex === shelter.headerImages.length - 1 ? 0 : prevIndex + 1);
            }, 10000); // Change image every 10 seconds
        }
        return null;
    };

    useEffect(() => {
        const timer = startRotationTimer();
        return () => clearInterval(timer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shelter.headerImages]);

    // Update current image index and reset timer for next/prev image
    const updateImageIndex = (newIndex) => {
        clearInterval(window.imageRotationTimer);
        setCurrentImageIndex(newIndex);
        window.imageRotationTimer = startRotationTimer();
    };

    const nextImage = () => {
        updateImageIndex(currentImageIndex === shelter.headerImages.length - 1 ? 0 : currentImageIndex + 1);
    };

    const prevImage = () => {
        updateImageIndex(currentImageIndex === 0 ? shelter.headerImages.length - 1 : currentImageIndex - 1);
    };

    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className={shelter.address ? "col-md-8" : "col-md-12"}>
                    <div className="card-body text-start" style={{padding: "2rem", paddingBottom: "3rem"}}>
                        
                        { shelter.description && <>
                            <h4 className="card-title">About {shelter.name}</h4>
                            <p className="card-text">
                                {shelter.description}
                            </p>
                        </>}
                        <h4 className="card-title">Contact Information</h4>
                        <p className="card-text">
                            {shelter.address && <>
                                <strong>Address:</strong>&nbsp;<a href={`https://www.google.com/maps/search/?api=1&query=${shelter.address}`} target="_blank" rel="noreferrer">{shelter.address}</a>
                                <br />
                            </>
                            }
                            {shelter.phone && <>
                                <strong>Phone Number:</strong>&nbsp;<a href={`tel:${shelter.phone}`}>{shelter.phone}</a>
                                <br />
                            </>
                            }
                            {shelter.email && <>
                                <strong>Email:</strong>&nbsp;<a href={`mailto:${shelter.email}`}>{shelter.email}</a>
                                    <br />
                                </>
                            }
                            {shelter.website && <>
                                <strong>Website:</strong>&nbsp;<a href={shelter.website} target="_blank" rel="noreferrer">{shelter.website}</a> 
                                <br />
                            </>
                            }

                            { auth.currentUser && shelter.shelterId !== auth.currentUser.uid && (
                                <Button variant="primary" style={{marginTop: "1rem"}}
                                onClick={() => navigate('/messages', {state:{userId: shelter.shelterId, userName: shelter.name}})}>Send Message</Button>
                            )}
                        </p>
                        {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
                    </div>
                </div>
                {shelter.address && (
                <div className="col-md-4">
                    {/* Google Maps */}
                    <div id="map" style={{width: "100%", height: "100%"}}>
                        <iframe
                            title="Google Maps"
                            width="100%"
                            height="100%"
                            style={{border: "0"}}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${shelter.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    
                    </div>

                </div>
                )}
            </div>
            {/* Image carousel row */}
            {shelter.headerImages && shelter.headerImages.length > 0 && (
                <>
                <hr style={{ marginTop: '0' }} />
                    <div className="row g-0 pb-4">
                        <div className="col-md-12">
                            <div className="image-carousel" style={{ textAlign: 'center', marginTop: '1rem', position: 'relative' }}>
                                {shelter.headerImages.length > 1 && (
                                    <>
                                        <FontAwesomeIcon icon={faChevronLeft} size="2x" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, cursor: 'pointer' }} onClick={prevImage} />
                                        <FontAwesomeIcon icon={faChevronRight} size="2x" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1, cursor: 'pointer' }} onClick={nextImage} />
                                    </>
                                )}
                                <img
                                    src={shelter.headerImages[currentImageIndex]}
                                    alt={`Slide ${currentImageIndex}`}
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', borderRadius: '0.25rem' }}
                                />
                            </div>
                        </div>
                        
                    </div>
                </>
            )}
        </div>
    );
}

export default ShelterInfoCard;