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

import axios from "axios";

const StockForecaster = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [suggestions, setSuggestions] = useState(stockSuggestions);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [stockName, setStockName] = useState("");
  // const [stockPredictionArray, setStockPredictionArray] = useState([]);

  // Uncomment if you want prediction to load on mount
  // useEffect(() => {
  //   axios.get("http://localhost:4000/data")
  //     .then((response) => {
  //       console.log(response.data);
  //       setStockName(response.data.stock_name);
  //       setStockPredictionArray(response.data.prediction_array);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data", error);
  //     });
  // }, []);

  const fetchCurrentData = async () => {
    if (!stockSymbol) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/todayprice/${stockSymbol}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      console.log("Current Stock Data:", data);
      setCurrentData(data);
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setCurrentData(getMockCurrentData(stockSymbol));
    }
    setLoading(false);
  };

  const predictNextDay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/predict/${stockSymbol}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setPredictedData(data);
      setHistoricalData(getMockHistoricalData());
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setPredictedData(getMockPredictedData(stockSymbol));
      setHistoricalData(getMockHistoricalData());
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <StockSearch
        stockSymbol={stockSymbol}
        setStockSymbol={setStockSymbol}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        handleSelectStock={(stock) => {
          setStockSymbol(stock.symbol);
          setShowSuggestions(false);
        }}
      />

      <StockDetails
        stockSymbol={stockSymbol}
        setStockSymbol={setStockSymbol}
        currentData={currentData}
        fetchCurrentData={fetchCurrentData}
        loading={loading}
      />

      <div className="mt-11 mb-11">
        <StockPrediction
          stockSymbol={stockSymbol}
          predictedData={predictedData}
          predictNextDay={predictNextDay}
          loading={loading}
        />
      </div>

      {/* <StockChart historicalData={historicalData} /> */}
    </div>
  );
};

export default StockForecaster;
