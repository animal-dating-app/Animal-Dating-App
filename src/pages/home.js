import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AnimalHomecard } from "../components/Cards";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAvailableAnimals = () => {
      const animalRef = collection(db, "animals");
      const animalQuery = query(
        animalRef,
        where("available", "==", true),
      );

      const unsubscribe = onSnapshot(animalQuery, (querySnapshot) => {
        const availableAnimals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((animal) => !animal.pendingAdoption); // Exclude animals with pendingAdoption set to true
        ;
        
        setAnimals(availableAnimals);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    getAvailableAnimals();
  }, []);

  // Slick Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // adjust the number of slides to show
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Set the speed of the carousel
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      <div className="container">
        <Slider {...sliderSettings}>
          {animals.map((animal) => (
            <div key={animal.id}>
              <AnimalHomecard animal={animal} />
            </div>
          ))}
        </Slider>
        
      </div>
    </>
  );
};

export default Home;
