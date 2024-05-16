import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import AdminInfoModal from "../components/Cards/AdminInfoModal";

const Admin = () => {

    const [shelters, setShelters] = useState();
    const [animals, setAnimals] = useState();
    const [adopters, setAdopters] = useState();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    const [userType, setUserType] = useState();
    const [animalDelErrList, setAnimalDelErrList] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const formRef = useRef(null);

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
        setUpdated(false);
    };
                
    useEffect(() => {

        getData();
    }, [updated]);
    
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
        //setPreviewID(user.id);

        
        setShowModal(true);
        
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
                setShowModal(false);
            }
            // Shelter has animal DONOT delete send alert
            else {
                if (animalDelErrList.length > 1) {
                    window.alert(`Cannot delete shelter because it has the following animals: ${animalDelErrList.join("\n")}`);
                    setAnimalDelErrList([]);
                }
                else {
                    window.alert(`Cannot delete shelter because it has the following animals: ${animalDelErrList}`);
                    setAnimalDelErrList([]);
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
                const tempList = animalDelErrList;
                tempList.push(animal.id);
                setAnimalDelErrList(tempList);
            }
        })
        return hasAnimals; 
    };

    // Set userInfo and userType to data from row
    const handleUpdate = async (uid, updatedUser) => {
        
        let userInfoUpdated = {...updatedUser};
        setUserInfo({...userInfoUpdated});
        delete userInfoUpdated.id;

        if (userType === "Shelter") {
            await updateDoc(doc(db, "shelters", userInfo.id), userInfoUpdated);
        }
        else if (userType === "Animal") {
            await updateDoc(doc(db, "animals", userInfo.id), userInfoUpdated);
        }
        else if (userType === "Adopter") {
            await updateDoc(doc(db, "users", userInfo.id), userInfoUpdated);
        }
    };

    return (
        <div className="container">
            {/* <Shelters Table */}
            <h1 style={{marginTop: "16px"}}>Shelters</h1>
            {!loading && (
                <div style={{textAlign: "left"}}> 
                     <table id="shelterTable" className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col" className="col-3">User ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Address</th>
                            <th scope="col" style={{textAlign: "center"}}>More</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {shelters && shelters.map((shelter, key) => {
                                return ( 
                                    <tr key={key}>
                                        <td>{shelter.id}</td>
                                        <td>{shelter.name}</td>
                                        <td>{shelter.address}</td>
                                        <td style={{textAlign: "center"}}><FontAwesomeIcon icon={faCircleInfo} onClick={()=> {handleRowClick(shelter, "Shelter")}} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <Animals Table */}
            <h1  style={{marginTop: "32px"}}>Animals</h1>
            {!loading && (
                <div style={{textAlign: "left"}}> 
                     <table className="table table-hover">
                        <thead>
                            <tr>

                            <th scope="col" className="col-3">User ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Shelter ID</th>
                            <th scope="col" style={{textAlign: "center"}}>More</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {animals && animals.map((animal, key) => {
                                return ( 
                                    <tr key={key}>
                                        <td>{animal.id}</td>
                                        <td>{animal.name}</td>
                                        <td>{animal.breed}</td>
                                        <td style={{textAlign: "center"}}><FontAwesomeIcon icon={faCircleInfo} onClick={()=> {handleRowClick(animal, "Animal")}} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <Adopters Table */}
            <h1 style={{marginTop: "32px"}}>Adopters</h1>
            {!loading && (
                <div style={{textAlign: "left"}}> 
                     <table className="table table-hover">
                        <thead>
                            <tr>
                            <th scope="col" className="col-3">User ID</th>
                            <th scope="col">Fist Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col" style={{textAlign: "center"}}>More</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {adopters && adopters.map((adopter, key)=> {
                                return ( 
                                    <tr key={key}>
                                        <td>{adopter.id}</td>
                                        <td>{adopter.firstName}</td>
                                        <td>{adopter.lastName}</td>
                                        <td style={{textAlign: "center"}}><FontAwesomeIcon icon={faCircleInfo} onClick={()=> {handleRowClick(adopter, "Adopter")}} /></td>
                                    </tr>
                                );      
                            })}
                        </tbody>
                    </table>
                </div>
            )}

           <AdminInfoModal showModal={showModal} setShowModal={setShowModal} userInfo={userInfo} setUserInfo={setUserInfo} userType={userType} 
                handleDelete={handleDelete} handleUpdate={handleUpdate} formRef={formRef} setUpdated={setUpdated} />

        
            
            
            
        </div>
    );
};

export default Admin;