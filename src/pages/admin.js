import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";


const Admin = () => {

    const [shelters, setShelters] = useState();
    const [animals, setAnimals] = useState();
    const [adopters, setAdopters] = useState();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    const [userType, setUserType] = useState();
    const [animalDelErrList, setAnimalDelErrList] = useState([]);
    const [docDeleted, setDocDeleted] = useState(false);

    const getData = async () => {
        // Shelter Data 
        const shelterRef = collection(db, "shelters");
        const shelterSnapshot = await getDocs(shelterRef);
        const shelterList = shelterSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        setShelters(shelterList);
        // Animal Data
        const animalRef = collection(db, "animals"); 
        const animalsSnapshot = await getDocs(animalRef);
        const animalList = animalsSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        setAnimals(animalList);
        // Adopter Data
        const adopterRef = collection(db, "users"); 
        const adoptersSnapshot = await getDocs(adopterRef);
        const adopterList = adoptersSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        setAdopters(adopterList);
        setLoading(false);
    };
                
    useEffect(() => {
        getData();
        setDocDeleted(false);

    }, []);
    
    // Update all shelterIds in animals to match shelterId 
    // from Database rather than the shelter authentication id 
    const addShelterID = () => {
        const updatedAnimals = [];
        // Loop through animals to add shelter database id
        animals.forEach((animal, i) => {
            // Find mathcing shelter
            let shelter = shelters.find(item => item.shelterId === animal.shelterId);
            // Add sid if found
            if (shelter !== undefined) {
                const shelterDBID = shelter.id;
                animal["sid"] = shelterDBID;
            }
            // Add to updated animals
            updatedAnimals.push(animal);
        })
        setAnimals(updatedAnimals);
    }


    // Set userInfo and userType to data from row
    const handleRowClick = (user, type) => {
        if (type === "Animal") {
            addShelterID();
        }
        setUserInfo(user);
        setUserType(type);
    };

    // Delete document
    const handleDelete = (uid) => {
        // Check if deleting shelter 
        if (userType && userType === "Shelter") {
            const hasAnimals = checkShelterAnimals(userInfo.id);
            // Shelter does not have any animals OK to delete
            if (hasAnimals === false) {

                const collection = "shelters"
                const docRef = doc(db, collection, uid);
                deleteDoc(docRef)
                .then(()=> {
                    getData();
                })
                .catch(error => {
                    console.log(error);
                })
            }
            // Shelter has animal DONOT delete send alert
            else {
                if (animalDelErrList.length > 1) {
                    window.alert(`Cannot delete shelter because it has the following animals: ${animalDelErrList.join("\n")}`);
                }
                else {
                    console.log("Here!!");
                    console.log(animalDelErrList);
                    window.alert(`Cannot delete shelter because it has the following animals: ${animalDelErrList}`);
                }
                
            }
        }
        // Else delete aninal or adopter
        else {
            const collection = (userType === "Animal") ? "animals" : "users"; 
            const docRef = doc(db, collection, uid);
            deleteDoc(docRef)
            .then(()=> {
                getData();
            })
            .catch(error => {
                console.log(error);
            })
            
        }
    };

    // Check if shelter has animals before delteing shelter
    const checkShelterAnimals = (sid) => {
        let hasAnimals = false;
        animals.forEach(animal => {
            if (animal.shelterId === userInfo.shelterId) {
                hasAnimals = true;
                // Add to list for alert
                setAnimalDelErrList(animalDelErrList => [...animalDelErrList, animal.id]);
            }
        })
        return hasAnimals; 
    };

    return (
        <div className="container">
            {/* <Shelters */}
            <h1>Shelters</h1>
            {!loading && (
                <div> 
                     <table id="shelterTable" className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">User ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">More</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {shelters && shelters.map((shelter, key) => {
                                return ( 
                                    <tr key={key}>
                                        <td>{shelter.id}</td>
                                        <td>{shelter.name}</td>
                                        <td>{shelter.address}</td>
                                        <td><FontAwesomeIcon icon={faCircleInfo} onClick={()=> {handleRowClick(shelter, "Shelter")}} 
                                            data-bs-toggle="modal" data-bs-target="#userInfoModal"/></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <Animals */}
            <h1>Animals</h1>
            {!loading && (
                <div> 
                     <table className="table table-hover">
                        <thead>
                            <tr>

                            <th scope="col">User ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Shelter ID</th>
                            <th scope="col">More</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {animals && animals.map((animal, key) => {
                                return ( 
                                    <tr key={key}>
                                        <td>{animal.id}</td>
                                        <td>{animal.name}</td>
                                        <td>{animal.breed}</td>
                                        <td><FontAwesomeIcon icon={faCircleInfo} onClick={()=> {handleRowClick(animal, "Animal")}} 
                                            data-bs-toggle="modal" data-bs-target="#userInfoModal"/></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <Adopters */}
            <h1>Adopters</h1>
            {!loading && (
                <div> 
                     <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col">User ID</th>
                            <th scope="col">Fist Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">More</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {adopters && adopters.map((adopter, key)=> {
                                return ( 
                                    <tr key={key}>
                                        <td>{adopter.id}</td>
                                        <td>{adopter.firstName}</td>
                                        <td>{adopter.lastName}</td>
                                        <td><FontAwesomeIcon icon={faCircleInfo} onClick={()=> {handleRowClick(adopter, "Adopter")}} 
                                            data-bs-toggle="modal" data-bs-target="#userInfoModal"/></td>
                                    </tr>
                                );      
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Popup Modal */}
            <div className="modal fade" id="userInfoModal" tabIndex="-1" aria-labelledby="userInfoModalLabel" aria-hidden="true" key={docDeleted}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">{userType} Data</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" align="left">
                            {/* Shelter Modal Body */}
                            {userType === "Shelter" && (
                                <div>
                                    <div><b>UID:</b> {userInfo.id}</div>
                                    <div><b>Name:</b> {userInfo.name}</div>
                                    <div><b>Address:</b> {userInfo.address}</div>
                                    <div><b>Phone:</b> {userInfo.phone}</div>
                                    <div><b>Email:</b> {userInfo.email}</div>
                                    <div><b>Description:</b> {userInfo.description}</div>
                                    <div><b>Header Images</b></div> 
                                    <div>
                                        {userInfo.headerImages && userInfo.headerImages.map((image, i) => {
                                            if (i === (userInfo.headerImages.length - 1)) {
                                                return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%"}}></img>
                                            }
                                            else {
                                                return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%", marginBottom:"16px"}}></img>
                                            }                                                   
                                        })}
                                    </div>                                                
                                </div>
                            )}    
                            {/* Animal Modal Body */}
                            {userType === "Animal" && (
                                <div> 
                                    <div ><b>UID:</b> {userInfo.id}</div>
                                    <div ><b>Name:</b> {userInfo.name}</div>
                                    <div><b>Tylie:</b> {userInfo.type}</div>
                                    <div><b>Breed:</b> {userInfo.breed}</div>
                                    <div><b>Gender:</b> {userInfo.gender}</div>
                                    <div><b>Age:</b> {userInfo.age}</div>
                                    <div><b>Shelter ID:</b> {userInfo.sid ? userInfo.sid : "Error getting Shelter ID"}</div>
                                    <div><b>Status:</b> {userInfo.status}</div>
                                    <div><b>Date Created:</b> {userInfo.dateCreated}</div>
                                    <div><b>Disposition:</b> {userInfo.disposition && userInfo.disposition.map((disp, i) => {
                                        if (i === (userInfo.disposition.length - 1)) {
                                            return (<p key={i} style={{display: "inline"}}>{disp}</p>)
                                        }
                                        else {
                                            return (<p key={i} style={{display: "inline"}}>{disp}, </p>)
                                        }
                                    })}</div>
                                    <div><b>Description:</b> {userInfo.name}</div> 
                                    <div><b>Images</b></div>
                                    {userInfo.pictureUri && !(typeof userInfo.pictureUri == "string") && userInfo.pictureUri.map((image, i) => {
                                        if (i === (userInfo.pictureUri.length - 1)) {
                                            return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%"}}></img>
                                        }
                                        else {
                                            return <img src={image} alt="Animal Images" key={i} style={{maxWidth: "100%", marginBottom:"16px"}}></img>
                                        }                                                   
                                    })}
                                    {userInfo.pictureUri && typeof userInfo.pictureUri == "string" &&  (
                                        <img src={userInfo.pictureUri} alt="Animal Images" style={{maxWidth: "100%"}}></img>
                                    )}       
                                </div>
                            )} 
                            {/* Adopter Modal Body */}
                            {userType === "Adopter" && (
                                <div> 
                                    <div><b>UID:</b> {userInfo.id}</div>
                                    <div><b>First Name:</b> {userInfo.firstName}</div>
                                    <div><b>Last Name:</b> {userInfo.lastName}</div>
                                    <div><b>Preferences:</b> {userInfo.preferences && userInfo.preferences.map((preference, i) => {
                                            if (i === (userInfo.preferences.length - 1)) {
                                                return (<p key={i} style={{display: "inline"}}>{preference}</p>)
                                            }
                                            else {
                                                return (<p key={i} style={{display: "inline"}}>{preference}, </p>)
                                            }
                                        })}
                                    </div>
                                </div>
                            )}   
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handleDelete(userInfo.id)}>Delete</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;