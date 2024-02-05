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
import Header from './components/Header/Header.js'
import Cats from "./pages/pets/cats.js";
import Dogs from "./pages/pets/dogs.js";
import Others from "./pages/pets/others.js";
import PageNotFound from "./components/404Page/404Page.js";

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
            <div className="pageWrapper">
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
            </div>
            <Footer />
        </>
    );
}

export default App;