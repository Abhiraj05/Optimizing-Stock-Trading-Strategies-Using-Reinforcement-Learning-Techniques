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
} from "./mockStockData"; // Import mock data

import axios from "axios"

const StockForecaster = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [suggestions, setSuggestions] = useState(stockSuggestions);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stockName,setStockName] = useState("");
  const [stockPredictionArray,setStockPredictionArray] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/data')
    .then(response => {
  
      console.log(response.data);
      setStockName(response.data.stock_name);
      setStockPredictionArray(response.data.prediction_array);
    })
    .catch(error => {
      console.error('Error fetching data', error);
    });
  },[])

  const fetchCurrentData = async () => {

    
    setLoading(true);
    try {
      const response = await fetch(`/api/current/${stockSymbol}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setCurrentData(data);
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setCurrentData(getMockCurrentData(stockSymbol)); // Use mock data
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
      setHistoricalData(getMockHistoricalData()); // Keep historical data
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setPredictedData(getMockPredictedData(stockSymbol)); // Use mock data
      setHistoricalData(getMockHistoricalData());
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      {stockName}
      {stockPredictionArray}
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
      <div>
        

      <StockDetails
        stockSymbol={stockSymbol}
        currentData={currentData}
        fetchCurrentData={fetchCurrentData}
        loading={loading}
      />
      </div>
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
