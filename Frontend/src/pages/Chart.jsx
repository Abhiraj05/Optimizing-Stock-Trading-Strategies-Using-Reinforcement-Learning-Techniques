import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import StockForecaster from "../components/StockForecaster";
import FadeIn from 'react-fade-in';


const Chart = () => {
  return (
    <FadeIn>
    <div className="min-h-screen bg-gray-500">
      <Navbar />
      <StockForecaster/>
      <Footer />
    </div>
    </FadeIn>
  );
};

export default Chart;
