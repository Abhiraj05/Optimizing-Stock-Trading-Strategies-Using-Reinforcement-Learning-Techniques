import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LandingPage } from "../components/LandingPage";

const Home = () => {



  return (
    <div className="min-h-screen bg-gray-700">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
};

export default Home;
