import React, { useState } from "react";
import StockDetails from "./StockDetails";
import StockPrediction from "./StockPrediction";
import StockChart from "./StockChart";


const StockForecaster = () => {
  const [topInput, setTopInput] = useState("");
  const [bottomInput, setBottomInput] = useState("");
  const [currentData, setCurrentData] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const fetchCurrentData = async () => {
    if (!topInput) return;
    setLoadingCurrent(true);
    try {
      const response = await fetch(
        `http://localhost:4000/todayprice/${topInput}`
      );
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      console.log("Current Stock Data:", data);
      setCurrentData(data);
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setCurrentData(getMockCurrentData(topInput));
    }
    setLoadingCurrent(false);
  };

  const predictNextDay = async () => {
    if (!bottomInput) return;
    setLoadingPrediction(true);

    try {
      const response = await fetch(
        `http://localhost:4000/prediction/${bottomInput}`
      );
      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      console.log("Prediction API Response:", data);

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      const formattedDate = nextDate.toLocaleDateString();

      setPredictedData({
        company: data.company,
        stock_name: data.stock_name,
        next_day_price: {
          open_price: data.next_day_price.open_price,
          close_price: data.next_day_price.close_price,
        },
        predictedOpen: data.predictedOpen,
        predictedClose: data.predictedClose,
        sentiment_score: data.sentiment_score,
        sentiment_breakdown: data.sentiment_breakdown,
        news: data.news,
        date: formattedDate,
      });

      // Update historical data based on API response
      setHistoricalData(data.historical_prices);
    } catch (error) {
      console.error("API failed, using mock data:", error);
      setPredictedData(getMockPredictedData(bottomInput));
      setHistoricalData(getMockHistoricalData());
    }

    setLoadingPrediction(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="mt-11 mb-11">
        <StockDetails
          stockSymbol={topInput}
          setStockSymbol={setTopInput}
          currentData={currentData}
          fetchCurrentData={fetchCurrentData}
          loading={loadingCurrent}
        />
      </div>
      <div className="mt-11 mb-11">
        <StockPrediction
          stockSymbol={bottomInput}
          setStockSymbol={setBottomInput}
          predictedData={predictedData}
          predictNextDay={predictNextDay}
          loading={loadingPrediction}
        />
      </div>
      <StockChart
        historicalData={historicalData}
        predictedNextDay={predictedData?.next_day_price}
      />
    </div>
  );
};

export default StockForecaster;





