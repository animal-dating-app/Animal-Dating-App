import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from 'react-toastify';
import Carousel from "../components/Carousel/Carousel";
import { useNavigate } from 'react-router-dom';
import catImage from '../assets/images/cat.png'; 
import dogImage from '../assets/images/dog.png'; 
import otherAnimalsImage from '../assets/images/other.png';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAvailableAnimals = () => {
      const animalRef = collection(db, "animals");
      const animalQuery = query(animalRef, where("status", "==", "Available"));

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
            toast.success(`${newAnimals.length} new ${newAnimals.length === 1 ? 'pet' : 'pets'} added!`);
          }

          setAnimals(availableAnimals);
        }
      });

      return () => unsubscribe();
    };

    getAvailableAnimals();
  }, [initialFetchComplete]);

  return (
    <>
              <style>
        {`
          .card:hover {
            transform: scale(1.05);
            z-index: 10;
            background-color: rgb(221, 237, 234);
          }
        `}
      </style>
      {loading && <p>Loading...</p>}
      

      {/* Container for Cards and Carousel */}
      <div className="container">
      
      {/* Carousel at the top of the cards */}
        <div className="row pb-4">
            <Carousel animals={animals} />
        
          {/* Cats Card */}
          <div className="col-6 col-lg-4 d-flex align-items-stretch my-2">
            <div className="card" style={{ width: '100%', cursor: 'pointer' }} onClick={() => navigate('/cats')}>
              <img src={catImage} className="card-img-top" alt="Cats"/>
              <div className="card-body">
                <h5 className="card-title">Cats</h5>
                <p className="card-text">Check out our adorable cats!</p>
              </div>
            </div>
          </div>

          {/* Dogs Card */}
          <div className="col-6 col-lg-4 d-flex align-items-stretch my-2">
            <div className="card" style={{ width: '100%', cursor: 'pointer' }} onClick={() => navigate('/dogs')}>
              <img src={dogImage} className="card-img-top" alt="Dogs"/>
              <div className="card-body">
                <h5 className="card-title">Dogs</h5>
                <p className="card-text">Check out our adorable dogs!</p>
              </div>
            </div>
          </div>

          {/* Others Card */}
          <div className="col-6 col-lg-4 d-flex align-items-stretch my-2">
            <div className="card" style={{ width: '100%', cursor: 'pointer' }} onClick={() => navigate('/others')}>
              <img src={otherAnimalsImage} className="card-img-top" alt="Others"/>
              <div className="card-body">
                <h5 className="card-title">Others</h5>
                <p className="card-text">Discover our other lovely animals!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;
