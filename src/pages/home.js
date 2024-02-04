import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from 'react-toastify';
import Carousel from "../components/Carousel/Carousel";
// import axios from 'axios';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  useEffect(() => {
    const getAvailableAnimals = () => {
      const animalRef = collection(db, "animals");
      const animalQuery = query(animalRef, where("available", "==", true));

      const unsubscribe = onSnapshot(animalQuery, (querySnapshot) => {
        const availableAnimals = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((animal) => !animal.pendingAdoption);

        if (!initialFetchComplete) {
          setAnimals(availableAnimals);
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
            // sendEmailNotification(newAnimals);
            toast.success(`${newAnimals.length} new ${newAnimals.length === 1 ? 'pet' : 'pets'} added!`);
          }

          setAnimals(availableAnimals);
        }
      });

      return () => unsubscribe();
    };

    getAvailableAnimals();
  }, [initialFetchComplete]);

  // const sendEmailNotification = async (newAnimals) => {
  //   try {
  //     // Call the Firebase Cloud Function
  //     await axios.post('////', { petDetails: newAnimals });
  //   } catch (error) {
  //     console.error('Eror:', error);
  //   }
  // };

  return (
    <>
      {loading && <p>Loading...</p>}
      <Carousel animals={animals} />
    </>
  );
};

export default Home;
