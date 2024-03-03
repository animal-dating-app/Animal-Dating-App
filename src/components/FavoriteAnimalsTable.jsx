import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, getDoc, updateDoc, doc, query, where } from "firebase/firestore";

function FavoriteAnimalTable() {
  const [isShelter, setShelter] = useState(true);
	const [userData, setUserData] = useState({});
	const [favorites, setFavorites] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const loadUser = async () => {
      // Check shelter docs for auth user ID
      const getAdoptUser = async () => {
        const qShelters = query(collection(db, "shelters"), where("shelterId", "==", auth.currentUser.uid));
        const shelterSnapshot = await getDocs(qShelters);
        const shelterUser = shelterSnapshot.docs.map ( doc => {
            return { id: doc.id, ...doc.data() };
        });
  
        if (shelterUser.length === 0) {
          const q = query(collection(db, "users"), where("userId", "==", auth.currentUser.uid));
          const adoptSnapshot = await getDocs(q);
          const adoptrUser = adoptSnapshot.docs.map ( doc => {
              return { id: doc.id, ...doc.data() };
          });
          // Update user if found
          if (adoptrUser.length > 0) {
              setUserData(adoptrUser[0]);
              setShelter(false);
  
              // Check if user has animal in favorites
              if (adoptrUser[0]?.favorites) {
                setFavorites(adoptrUser[0].favorites);
              }
          }
        }
      };
  
      if (user) {
        getAdoptUser();
      }
    };
      loadUser();
  }, [user]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favoritesArray = [];
      for (let i = 0; i < favorites.length; i++) {
        const animal = await getDoc(doc(db, "animals", favorites[i]));

        if (animal.exists()) {
          favoritesArray.push({
            id: animal.id,
            ...animal.data()
          });
        }
      }
      setFavoritesData(favoritesArray);
      console.log(favoritesArray)
    };

    loadFavorites();
  }, [favorites]);

  const removeFavorite = async (animalId) => {
    // Remove animal from favorites
    const newFavorites = favorites.filter(favorite => favorite !== animalId);
    const userDoc = doc(db, "users", userData.id);
    await updateDoc(userDoc, {
      favorites: newFavorites
    });
    setFavorites(newFavorites);
  }

  return (
    <>
    { !isShelter && (
      <div className="container mt-4">
        <h1>Favorite Animals</h1>
          { favoritesData.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {favoritesData.map((animal) => (
                    <tr key={animal.id}>
                      <td>{animal.name}</td>
                      <td>{animal.type}</td>
                      <td>
                        <button onClick={() => navigate('/pet', {state:{pet:animal}})} className="btn btn-secondary me-2">View</button>
                        <button onClick={() => removeFavorite(animal.id)} className="btn btn-danger me-2">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="table">
                <tbody>
                  <tr>
                    <td>No favorite animals found</td>
                  </tr>
                </tbody>
              </table>
            )}
        </div>
      )}
    </>
  );
}

export default FavoriteAnimalTable;