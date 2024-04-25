import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

import ChatMessagesCard from "../components/Cards/ChatMessagesCard";

const Messages = () => {

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const [user, setUser] = useState({});
    const [isShelter, setShelter] = useState(false);

    useEffect(() => {

      // Get user info from shelter or user database
      const loadUser = async () => {

          // Check shelter docs for auth user ID
          const getShelterUser = async () => {
              const q = query(collection(db, "shelters"), where("shelterId", "==", auth.currentUser.uid));
              const shelterSnapshot = await getDocs(q);
              const shelterUser = shelterSnapshot.docs.map ( doc => {
                  return { id: doc.id, ...doc.data() };
              });
              // Update user if found
              if (shelterUser.length > 0) {
                  setUser(shelterUser[0]);
                  setShelter(true);
              }
          };

          // Check user docs for auth user ID
          const getAdoptUser = async () => {
              const q = query(collection(db, "users"), where("userId", "==", auth.currentUser.uid));
              const adoptSnapshot = await getDocs(q);
              const adoptUser = adoptSnapshot.docs.map ( doc => {
                  return { id: doc.id, ...doc.data() };
              });
              // Update user if found
              if (adoptUser.length > 0) {
                  setUser(adoptUser[0]);
              }
          };

          // Search for shelter user 
          getShelterUser();

          // Search for adopt user if not found in shelter
          if (!isShelter) {
              getAdoptUser();
          } 
      };

      loadUser();
  }, [isShelter]);

    return (
      <>
        <div className="container mb-4">
            <ChatMessagesCard user={user} />
        </div>
      </>
    );
};

export default Messages;
