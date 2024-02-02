import React, { useState, useEffect } from "react";
import "./App.css";
import { auth } from "./firebaseConfig";
import Navbar from "./components/Navbar.In";
import Footer from "./components/Footers/Footer.js";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/home.js";
import Pets from "./pages/pets.js";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin.js";
import Dashboard from "./pages/shelterDashboard.js";
import Pet from "./pages/pet.js";
import FullScreenLoader from './components/FullScreenLoader';
import Header from './components/Header/Header.js'
import Cats from "./pages/pets/cats.js";
import Dogs from "./pages/pets/dogs.js";
import Others from "./pages/pets/others.js";
import PageNotFound from "./404Page";


function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setTimeout(() => {
                setIsFadingOut(true);
            }, 200); // Always show the loader for at least 200ms

            setTimeout(() => {
                setLoading(false);
            }, 1200); // Delay + duration of the fade out animation
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <div className="App">
                {loading && <FullScreenLoader fadingOut={isFadingOut} />}
                <Header /> 
                <Navbar user={user} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pets" element={<Pets />}>
                        <Route path="cats" element={<Cats />} />
                        <Route path="dogs" element={<Dogs />} />
                        <Route path="others" element={<Others />} />
                    </Route>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sign-up" element={<SignUp user={user} />} />
                    <Route path="/sign-in" element={<SignIn user={user} />} />
                    <Route path="/pet" element={<Pet />} />
                    <Route
                    path="*"
                    element={<PageNotFound />}
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;