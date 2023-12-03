import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AnimalGalleryCard } from "../components/Cards";

const Pets = () => {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        const getAnimals = async () => {
            const animalRef = collection(db, "animals");
            const animalSnapshot = await getDocs(animalRef);
            const animalList = animalSnapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            setAnimals(animalList);
        };

        getAnimals();
    }, []);

    return (
        <>
            <div className="container">
                <div className="row pb-4">
                {animals.length > 0 && animals.map(animal => (
                    <div class="col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
                        <AnimalGalleryCard animal={animal} />
                    </div>
                ))}
                </div>
            </div>
        </>
    );
};

export default Pets;
