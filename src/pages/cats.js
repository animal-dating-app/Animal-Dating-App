import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from 'react-toastify';
import { AnimalGalleryCard } from "../components/Cards";
import { useNavigate } from 'react-router-dom'; 

const Cats = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getAvailableCats = () => {
      const animalRef = collection(db, "animals");
      const animalQuery = query(
        animalRef,
        where("status", "==", "Available"),
        where("type", "==", "Cat")
      );

      const unsubscribe = onSnapshot(animalQuery, (querySnapshot) => {
        const availableCats = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((animal) => !animal.pendingAdoption);

        if (!initialFetchComplete) {
          setAnimals(availableCats);
          setLoading(false);
          setInitialFetchComplete(true);
        } else {
          const newCats = querySnapshot.docChanges()
            .filter(change => change.type === 'added')
            .map(change => ({
              id: change.doc.id,
              ...change.doc.data(),
            }));

          if (newCats.length > 0) {
            toast.success(`${newCats.length} new ${newCats.length === 1 ? 'cat' : 'cats'} added!`);
          }

          setAnimals(availableCats);
        }
      });

      return () => unsubscribe();
    };

    getAvailableCats();
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

export default Cats;
