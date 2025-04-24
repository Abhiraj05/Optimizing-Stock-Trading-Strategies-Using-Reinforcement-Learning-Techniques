import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LandingPage } from "../components/LandingPage";
import FadeIn from 'react-fade-in';
const Home = () => {



  return (
    <FadeIn>
    <div className="min-h-screen bg-gray-700">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
    </FadeIn>
  );
};

export default Home;
