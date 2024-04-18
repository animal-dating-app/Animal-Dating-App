import React, { useState, useEffect } from "react";
import {useLocation, useNavigate } from 'react-router-dom';
import { AnimalCard }  from "../components/Cards";
import { auth, db } from "../firebaseConfig";
import { getDoc, doc, query, where, collection, getDocs } from "firebase/firestore";
import EditAnimalModal from "../components/Cards/EditAnimalModal";
import { Button } from "react-bootstrap";

const Pet = () => {

    // Animal passed to component
    const location = useLocation();
    const animal = location.state.pet;

    const navigate = useNavigate();

    // Get user from auth 
    const user = auth.currentUser;
    // Check if user is owner of animal 
    let owner = false;
    if (user) {
         owner = (user.uid === animal.shelterId) ? true : false;
    }

    const [animals, setAnimal] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    const [shelter, setShelter] = useState();

    const loadAnimals = async () => {
        const getAnimals = async () => {
            const item = doc(db, "animals", animal.id);
            const itemSnap = await getDoc(item);
            setAnimal(itemSnap.data());
        };

        getAnimals();
    };

    useEffect(() => {
        const getAnimals = async () => {
            const item = doc(db, "animals", animal.id);
            const itemSnap = await getDoc(item);
            setAnimal(itemSnap.data());
        };

        const getShelter = async () => { 
            const q = query(collection(db, "shelters"), where("shelterId", "==", animal.shelterId));
            const shelterSnapshot = await getDocs(q);
            const shelterList = shelterSnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            
            setShelter(shelterList[0]);
        };

        getAnimals();
        getShelter();

    }, [animal.id, animal.shelterId]);

    const editAnimal = () => {
        setShowEditModal(true);
    }

    return (
        <div className="container">
            <div className=" col-sm-5 mx-auto">
                {/* Load animal */}
                { animals && ( 
                    <AnimalCard animal={animals} animalId={animal.id} />
                )}
                {/* Edit button if owner of animal*/}
                { owner && (
                    <div>
                        <button type="button" onClick={editAnimal} className="btn btn-secondary btn-lg btn-block" style={{margin: "0.25rem", width: "95%"}}>Edit Animal</button>
                    </div>
                )}
                {/* Contact button with message popup otherwise*/}
                {!owner && (
                    <div>
                        <button type="button" className="btn btn-primary btn-lg btn-block" 
                        style={{margin: "0.25rem", width: "95%"}} data-bs-toggle="modal" data-bs-target="#contactModal">
                            Contact Shelter
                        </button>
                        <button type="button" className="btn btn-primary btn-lg btn-block" 
                        style={{margin: "0.25rem", width: "95%"}} onClick={() => window.location.href = "/shelter/" + animal.shelterId}>
                            View Shelter
                        </button>

                        <div className="modal fade" id="contactModal" tabIndex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Contact Information</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {shelter && shelter.email !== null && (
                                            <p>Contact Email: {shelter.email}</p>
                                        )}
                                        {shelter && (
                                            <p>Phone Number: {shelter.phone}</p>
                                        )}          
                                        {shelter && (
                                            <Button variant="primary" style={{marginTop: "1rem"}} data-bs-dismiss="modal"
                                            onClick={() => navigate('/messages', {state:{pet: animal, shelterId: animal.shelterId, shelterName: shelter.name}})}
                                            >Send Message</Button>
                                        )}                      
                                    </div>
                                    <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <EditAnimalModal showModal={showEditModal} setShowModal={setShowEditModal} loadAnimals={loadAnimals} animal={animal} />
            </div>
        </div>
    );
};

export default Pet;