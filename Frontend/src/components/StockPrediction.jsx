import React from "react";

const StockPrediction = ({ stockSymbol, setStockSymbol, predictedData, predictNextDay, loading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg ">
      <h2 className="text-xl font-semibold mb-4">Predict Next Day's Stock Price</h2>
      <div className="mb-4">
        <label className="block text-gray-400 mb-2">Enter Stock Symbol:</label>
        <div className="flex">
          <input
            type="text"
            className="bg-gray-700 text-white p-2 rounded-l-lg w-full focus:outline-none pl-4"
            placeholder="e.g., RELIANCE.BSE"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}  
          />
          <button className="text-green-400 border-2 border-green-400 hover:bg-green-400 hover:text-gray-700 px-4 py-2 rounded-r-lg" onClick={predictNextDay}>
            Predict
          </button>
        </div>
      </div>

      {loading && <p className="text-center my-4">Loading...</p>}

      {predictedData && !loading && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-lg">{predictedData.symbol}</h3>
          <p className="text-gray-400">{predictedData.date} (Predicted)</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-400">Predicted Open</p>
              <p className="text-lg font-bold text-green-400">₹{predictedData.predictedOpen.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Predicted Close</p>
              <p className="text-lg font-bold text-green-400">₹{predictedData.predictedClose.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPrediction;
