import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import FullScreenLoader from "../components/FullScreenLoader";
import { AnimalGalleryCard } from "../components/Cards";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const PetMatcher = () => {
  // if user is not logged in, redirect to sign in page
  if (!auth.currentUser) window.location.href = "/sign-in";

  const [user, setUser] = useState({});
  const [animals, setAnimals] = useState([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [endOfOptions, setEndOfOptions] = useState(false);
  const [dismissedPets, setDismissedPets] = useState([]);
  const [swipeOpacity, setSwipeOpacity] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [familyDetails, setFamilyDetails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const q = query(
        collection(db, "users"),
        where("userId", "==", auth.currentUser.uid)
      );
      const adoptSnapshot = await getDocs(q);
      const adoptrUser = adoptSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      // Update user if found
      if (adoptrUser.length > 0) {
        setUser(adoptrUser[0]);
        setDismissedPets(adoptrUser[0].dismissedPets || []);
        setFamilyDetails(adoptrUser[0].familyDetails || []);
      } else {
        navigate("/shelterDashboard");
      }
    };

    loadUser();
  }, [navigate]);

  useEffect(() => {
    if (user.dismissedPets) {
      setDismissedPets(user.dismissedPets);
    }
  }, [user.dismissedPets]);

  useEffect(() => {
    const fetchAnimals = async () => {
      const animalRef = collection(db, "animals");
      const q = query(
        animalRef,
        where("status", "in", ["Available", "Pending"])
      );
      const snapshot = await getDocs(q);
      let animalList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (animal) =>
            !user.dismissedPets || !user.dismissedPets.includes(animal.id)
        );

      // Separate animals based on user preferences
      const priorityMatched = [];
      const matchedAnimals = [];
      const priorityOther = [];
      const otherAnimals = [];

      animalList.forEach((animal) => {
        if (user.preferences && user.preferences.includes(animal.type)) {
          // If animal is good with kids and user has kids, add to preferredMatched, or if animal is good with other pets and user has other pets add to preferredMatched
          if (
            (animal.disposition && animal.disposition.includes("Good with children") &&
              familyDetails.includes("Have Kids")) ||
            (animal.disposition && animal.disposition.includes("Good with other animals") &&
              familyDetails.includes("Have Pets"))
          ) {
            priorityMatched.push(animal);
          } else {
            matchedAnimals.push(animal);
          }
        } else {
          if (
            (animal.disposition && animal.disposition.includes("Good with children") &&
              familyDetails.includes("Have Kids")) ||
            (animal.disposition && animal.disposition.includes("Good with other animals") &&
              familyDetails.includes("Have Pets"))
          ) {
            priorityOther.push(animal);
          } else {
            otherAnimals.push(animal);
          }
        }
      });

      // Function to randomize arrays
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };

      // Shuffle all arrays
      shuffleArray(priorityMatched);
      shuffleArray(matchedAnimals);
      shuffleArray(priorityOther);
      shuffleArray(otherAnimals);

      // Combine arrays, with preferred animals first
      animalList = [...priorityMatched, ...matchedAnimals, ...priorityOther, ...otherAnimals];

      setAnimals(animalList);
      setFadingOut(true);
      setTimeout(() => setLoading(false), 1000);
    };

    if (user.id) {
      // Make sure user data is loaded
      fetchAnimals();
    }
  }, [user.id, user.dismissedPets, user.preferences, familyDetails]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleDismiss();
      setSwipeOpacity(0);

      // setTimeout(() => {
        setSwipeDirection(null);
      // }, 300);
    },
    onSwipedRight: () => {
      handleLike();
      setSwipeOpacity(0);

      // setTimeout(() => {
        setSwipeDirection(null);
      // }, 300);
    },
    onSwiping: (eventData) => {
      setSwipeOpacity(
        Math.min(0.4, Math.min(Math.abs(eventData.deltaX) / 100, 1))
      );
      setSwipeDirection(eventData.dir);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleDismiss = async () => {
    const dismissedPetId = animals[currentPetIndex].id;
    const updatedDismissedPets = [...(dismissedPets || []), dismissedPetId];

    // Update user in Firestore
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { dismissedPets: updatedDismissedPets });

    setDismissedPets(updatedDismissedPets);

    if (currentPetIndex < animals.length - 1) {
      setCurrentPetIndex(currentPetIndex + 1);
    } else {
      setEndOfOptions(true);
    }
  };

  const handleLike = async () => {
    let favorites = [];

    if (user?.id) {
      const query = doc(db, "users", user.id);
      const docSnap = await getDoc(query);
      favorites = docSnap?.data()?.favorites;
    }

    if (!favorites || !favorites.includes(animals[currentPetIndex].id)) {
      if (!favorites) {
        favorites = [];
      }
      const userRef = doc(db, "users", user.id);
      const newFavorites = [...favorites, animals[currentPetIndex].id];
      await updateDoc(userRef, { favorites: newFavorites });
    }

    if (currentPetIndex < animals.length - 1) {
      setCurrentPetIndex(currentPetIndex + 1);
    } else {
      setEndOfOptions(true);
    }
  };

  const sendMessage = () => {
    const shelterId = animals[currentPetIndex].shelterId;

    const q = query(
      collection(db, "shelters"),
      where("shelterId", "==", shelterId)
    );
    getDocs(q).then((snapshot) => {
      const shelter = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[0];
      navigate("/messages", {
        state: {
          pet: animals[currentPetIndex],
          userId: shelterId,
          userName: shelter.name,
        },
      });
    });
  };

  if (loading) {
    return <FullScreenLoader fadingOut={fadingOut} />;
  }

  if (animals.length === 0) {
    return <div>No pets available for adoption at this time.</div>;
  }

  const currentPet = animals[currentPetIndex];
  const swipeColor = swipeDirection === "Right" ? "#4ab22d" : "#ff5757";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          opacity: swipeOpacity,
          position: "fixed",
          height: "100%",
          width: "100%",
          zIndex: 100,
          background:
            "radial-gradient(circle, " +
            swipeColor +
            " 0%, rgba(255,255,255,0) 100%)",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transition: "opacity 0.5s ease",
          display: swipeOpacity > 0 ? "block" : "none",
        }}
      />
      {endOfOptions ? (
        <div style={{ marginTop: "20px" }}>
          <p>
            You have reached the end of the list. Check back later for more
            pets!
          </p>
        </div>
      ) : (
        <>
          <div style={{ margin: "20px", maxWidth: "300px" }} {...handlers}>
            <AnimalGalleryCard
              animal={currentPet}
              onClickAnimal={() =>
                navigate("/pet", { state: { pet: currentPet } })
              }
              callToAction={""}
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <button
              onClick={handleDismiss}
              style={{
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#ff5757",
                height: "52px",
                width: "52px",
                color: "black",
              }}
            >
              <FontAwesomeIcon icon={faTimes} size="2x" />
            </button>
            <button
              onClick={sendMessage}
              style={{
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#809bce",
                height: "52px",
                width: "52px",
                color: "black",
              }}
            >
              <FontAwesomeIcon icon={faCommentDots} size="2x" />
            </button>
            <button
              onClick={handleLike}
              style={{
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#4ab22d",
                height: "52px",
                width: "52px",
                color: "black",
              }}
            >
              <FontAwesomeIcon icon={faCheck} size="2x" />
            </button>
          </div>
          <br />
          <p>
            Liked pets will be added to your favorites list. Dismissed pets will
            not be shown again.
          </p>
        </>
      )}
    </div>
  );
};

export default PetMatcher;
