import React from "react";
import "./App.css";
import Navbar from "./components/Navbar.In";
import Footer from "./components/Footers/Footer.js";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { UserProvider, useUser } from './UserContext';
import Home from "./pages/home.js";
import Pets from "./pages/pets.js";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin.js";
import Dashboard from "./pages/shelterDashboard.js";
import Pet from "./pages/pet.js";
import FullScreenLoader from './components/FullScreenLoader';
import Header from './components/Header/Header.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubscriptionPlansPage from './components/SubscriptionPlan/SubPage.js'




function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <AuthenticatedApp />
                </div>
            </Router>
        </UserProvider>
    );
}

function AuthenticatedApp() {
    const { user, userLoaded, showUserLoader, startFading } = useUser();

    if (!userLoaded) { return <FullScreenLoader />}

    return (
        <>
            { showUserLoader && <FullScreenLoader fadingOut={startFading} /> }
            <Header />
            <Navbar user={user} />
            <ToastContainer />
            <div className="pageWrapper">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sign-up" element={<SignUp user={user} />} />
                    <Route path="/sign-in" element={<SignIn user={user} />} />
                    <Route path="/pet" element={<Pet />} />
                    <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default App;