import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from 'react-toastify';
import { AnimalGalleryCard } from "../components/Cards";
import { useNavigate } from 'react-router-dom'; 

const Others = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getOtherAnimals = () => {
      const animalRef = collection(db, "animals");
      const animalQuery = query(
        animalRef,
        where("status", "==", "Available"),
        where("type", "not-in", ["Cat", "Dog"]) // Excluding cats and dogs
      );

      const unsubscribe = onSnapshot(animalQuery, (querySnapshot) => {
        const otherAnimals = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((animal) => !animal.pendingAdoption);

        if (!initialFetchComplete) {
          setAnimals(otherAnimals);
          setLoading(false);
          setInitialFetchComplete(true);
        } else {
          const newAnimals = querySnapshot.docChanges()
            .filter(change => change.type === 'added')
            .map(change => ({
              id: change.doc.id,
              ...change.doc.data(),
            }));

          if (newAnimals.length > 0) {
            toast.success(`${newAnimals.length} new ${newAnimals.length === 1 ? 'animal' : 'animals'} added!`);
          }

          setAnimals(otherAnimals);
        }
      });

      return () => unsubscribe();
    };

    getOtherAnimals();
  }, [initialFetchComplete]);

  return (
    <>
      {loading && <p>Loading...</p>}
      <div className="container">
        <div className="row pb-4">
          {animals.map(animal => (
            <div className="col-6 col-lg-4 d-flex align-items-stretch my-2" key={animal.id}>
              <AnimalGalleryCard animal={animal} onClickAnimal={() => navigate('/pet', {state: {pet: animal}})}/>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Others;
