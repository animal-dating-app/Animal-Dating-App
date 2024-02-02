import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { AnimalHomecard } from "../components/Cards";
import Carousel from "../components/Carousel/Carousel";

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <Carousel animals={animals} />
    </>
  );
};

export default Home;
