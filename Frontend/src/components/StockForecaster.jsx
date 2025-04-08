import React, { useEffect, useState } from "react";
import StockSearch from "./StockSearch";
import StockDetails from "./StockDetails";
import StockPrediction from "./StockPrediction";
// import StockChart from "./StockChart";

import {
  stockSuggestions,
  getMockCurrentData,
  getMockPredictedData,
  getMockHistoricalData,
} from "./mockStockData";

const StockForecaster = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  // const [suggestions, setSuggestions] = useState(stockSuggestions);
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const fetchCurrentData = async () => {
    if (!stockSymbol) return;
    setLoadingCurrent(true);
    try {
      const response = await fetch(
        `http://localhost:4000/todayprice/${stockSymbol}`
      );
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      console.log("Current Stock Data:", data);
      setCurrentData(data);
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setCurrentData(getMockCurrentData(stockSymbol));
    }
    setLoadingCurrent(false);
  };

  const predictNextDay = async () => {
    setLoadingPrediction(true);
    try {
      const response = await fetch(
        `http://localhost:4000/prediction/${stockSymbol}`
      );
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      console.log("Prediction API Response:", data);
      setPredictedData({
        symbol: data.stock_name,
        predictedOpen: data.today_price.open_price,
        predictedClose: data.today_price.close_price,
        date: new Date().toLocaleDateString(),
      });

      setHistoricalData(getMockHistoricalData());
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setPredictedData(getMockPredictedData(stockSymbol));
      setHistoricalData(getMockHistoricalData());
    }
    setLoadingPrediction(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      {/* <StockSearch
        stockSymbol={stockSymbol}
        setStockSymbol={setStockSymbol}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        handleSelectStock={(stock) => {
          setStockSymbol(stock.symbol);
          setShowSuggestions(false);
        }} */}
      {/* /> */}
      <div className="mt-11 mb-11">
        <StockDetails
          // stockSymbol={stockSymbol}
          setStockSymbol={setStockSymbol}
          currentData={currentData}
          fetchCurrentData={fetchCurrentData}
          loading={loadingCurrent}
        />
      </div>
      <div className="mt-11 mb-11">
        <StockPrediction
          // stockSymbol={stockSymbol}
          predictedData={predictedData}
          predictNextDay={predictNextDay}
          loading={loadingPrediction}
        />
      </div>

      {/* <StockChart historicalData={historicalData} /> */}
    </div>
  );
};

export default StockForecaster;
