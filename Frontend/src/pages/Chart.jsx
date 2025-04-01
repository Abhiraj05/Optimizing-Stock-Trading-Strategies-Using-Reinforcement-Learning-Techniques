import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
// import { StockAnalysis } from "../components/StockAnalysis";
import StockForecaster from "../components/StockForecaster";



const Chart = () => {
  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar />
      {/* <StockAnalysis /> */}
      <StockForecaster/>
      <Footer />
    </div>
  );
};

export default Chart;
