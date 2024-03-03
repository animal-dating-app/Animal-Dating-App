import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, getDoc, updateDoc, doc, query, where, addDoc } from "firebase/firestore";

function FavoriteButton({ animal, animalId }) {
  const [isShelter, setShelter] = useState(true);
	const [userData, setUserData] = useState({});
	const [isFavorite, setIsFavorite] = useState(false);

  const user = auth.currentUser;
  let owner = false;
  if (user) {
    owner = user.uid === animal.shelterId ? true : false;
  }

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
              if (adoptrUser[0].favorites?.includes(animalId)) {
                setIsFavorite(true);
              }
          }
        }
      };
  
      if (user) {
        getAdoptUser();
      }
    };
      loadUser();
  }, [user, animalId]);
  
  const handleFavoriteClick = async () => {
    // Get current favorites list
    let favorites = [];

    if (userData?.id) {
      const query = doc(db, "users", userData.id)
      const docSnap = await getDoc(query);
      favorites = docSnap?.data()?.favorites;
  }

    if (isFavorite) {
      // Update doc in user favorites
      const userRef = doc(db, "users", userData.id);

      const newFavorites = favorites.filter((id) => id !== animalId);
      await updateDoc(userRef, {
        favorites: newFavorites,
      });
      setIsFavorite(false);
    } else {
      // Update doc in user favorites
      if (!userData || !userData.id) {
        await addDoc(collection(db, "users"), {
          userId: auth.currentUser.uid,
          favorites: [animalId],
        });
      } else {
        const userRef = doc(db, "users", userData.id);
  
        if (!userData.favorites) {
          await updateDoc(userRef, {
            favorites: [animalId],
          });
          return;
        } else {
          let newFavorites = [...favorites, animalId];
          newFavorites = new Set(newFavorites);

          await updateDoc(userRef, {
            favorites: Array.from(newFavorites),
          });
        }
        setIsFavorite(true);
      }
    }
  }

  return (
    <>
    {( !owner && !isShelter &&
      <FontAwesomeIcon 
        icon={isFavorite ? faHeart : faHeartOutline}
        size="lg" color={isFavorite ? "red" : "black"}
        onClick={() => handleFavoriteClick()}
        className="pet-favorite"
        style={{cursor: "pointer"}}
      />
    )}
    </>
  );
}

export default FavoriteButton;