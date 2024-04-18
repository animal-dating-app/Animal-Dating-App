import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Admin = () => {

    const [shelters, setShelters] = useState();
    const [animals, setAnimals] = useState();
    const [adopters, setAdopters] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        getData();

    }, []);

    return (
        <div className="container">
            {/* <Shelters */}
            <h3>Shelters</h3>
            {!loading && (
                <div> 
                     <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Address</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Description</th>
                            <th scope="col">Select</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {shelters && shelters.map(shelter=> {
                                return ( 
                                    <tr>
                                        <td>{shelter.name}</td>
                                        <td>{shelter.email}</td>
                                        <td>{shelter.address}</td>
                                        <td>{shelter.phone}</td>
                                        <td>{shelter.description}</td>
                                        <td><input type="checkbox" />&nbsp;</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <Animals */}
            <h3>Animals</h3>
            {!loading && (
                <div> 
                     <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Breed</th>
                            <th scope="col">Age</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Disposition</th>
                            <th scope="col">Availability</th>
                            <th scope="col">Date Created</th>  
                            <th scope="col">Select</th>  
                            </tr>
                        </thead>
                        <tbody>  
                            {animals && animals.map(animal=> {
                                return ( 
                                    <tr>
                                        <td>{animal.name}</td>
                                        <td>{animal.type}</td>
                                        <td>{animal.breed}</td>
                                        <td>{animal.age}</td>
                                        <td>{animal.gender}</td>
                                        <td>{animal.disposition && animal.disposition.map((disp, i) => {
                                            if (i === (animal.disposition.length - 1)) {
                                                return (`${disp}`)
                                            }
                                            else {
                                                return (`${disp}, `)
                                            }
                                        })}</td>
                                        <td>{animal.status}</td>
                                        <td>{animal.dateCreated}</td>
                                        <td><input type="checkbox" />&nbsp;</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {/* <Adopters */}
            <h3>Adopters</h3>
            {!loading && (
                <div> 
                     <table class="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Fist</th>
                            <th scope="col">Last</th>
                            <th Preferen="col">Preferences</th>
                            <th scope="col">Select</th>
                            </tr>
                        </thead>
                        <tbody>  
                            {adopters && adopters.map(adopter=> {
                                return ( 
                                    <tr>
                                        <td>{adopter.firstName}</td>
                                        <td>{adopter.lastName}</td>
                                        <td>{adopter.preferences && adopter.preferences.map((preference, i) => {
                                            if (i === (adopter.preferences.length - 1)) {
                                                return (`${preference}`)
                                            }
                                            else {
                                                return (`${preference}, `)
                                            }
                                        })}</td>
                                        <td><input type="checkbox" />&nbsp;</td>
                                    </tr>
                                );      
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;