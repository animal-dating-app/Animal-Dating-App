import React from "react";
import "./App.css";
import Navbar from "./components/Navbar.In";
import Footer from "./components/Footers/Footer.js";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Homes from "./pages/availablepet";
import Pets from "./pages/pets.js";
//import availablepet from "./pages/availablepet";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin.js";
import Dashboard from "./pages/shelterDashboard.js";
import Pet from "./pages/pet.js";
import PagePanel from "./components/Panel/PagePanel";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <PagePanel/>
                <div className="container-fluid text-center mt-5">
                    <h1>Dating App for Animal Adoption</h1>
                </div>
                <Routes>
                    <Route path="/" element={<Homes />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/pet" element={<Pet />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;