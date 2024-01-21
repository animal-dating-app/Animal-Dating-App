import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {AnimalHomecard} from "../components/Cards";

const Homes = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getAvailableAnimals = () => {
            const animalRef = collection(db, "animals");
            const animalQuery = query(
                animalRef,
                where("available", "==", true),
               // where("pendingAdoption", "==", true)
            );

            const unsubscribe = onSnapshot(animalQuery, (querySnapshot) => {
                const availableAnimals = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAnimals(availableAnimals);
                setLoading(false);
            });

            return () => unsubscribe(); 
        };

        getAvailableAnimals();
    }, []);

    return (
        <>
            {loading && <p>Loading...</p>}
            <div className="container">
                <div className="row pb-4">
                    {animals.map((animal) => (
                        <div className="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                            <AnimalHomecard animal={animal} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Homes;
