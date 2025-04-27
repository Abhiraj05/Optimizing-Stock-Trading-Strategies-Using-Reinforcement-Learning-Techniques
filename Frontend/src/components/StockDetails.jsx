import React from "react";

const StockDetails = ({ stockSymbol, setStockSymbol, currentData, fetchCurrentData, loading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Get Today's Stock Price</h2>
      <div className="mb-4">
        <label className="block text-gray-400 mb-2">Enter Stock Symbol:</label>
        <div className="flex">
          <input
            type="text"
            className="bg-gray-700 text-white p-2 rounded-l-lg w-full focus:outline-0 pl-4"
            placeholder="e.g., RELIANCE"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
           
          />
          <button
            className="text-green-400 border-2 border-green-400 hover:bg-green-400 hover:text-gray-700 px-4 py-2 rounded-r-lg"
            onClick={fetchCurrentData}
          >
            Today's Price
          </button>
        </div>
      </div>

      {loading && <p className="text-center my-4">Loading...</p>}

      {currentData && !loading && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2 uppercase">{currentData.name} ({stockSymbol}.BO)</h3> 
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-400">Market Price</p>
              <p className="text-lg font-bold text-green-300">₹{currentData.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Previous Close</p>
              <p className="text-lg font-bold">₹{currentData.close.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Open</p>
              <p className="text-lg font-bold">₹{currentData.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">High</p>
              <p className="text-lg font-bold">₹{currentData.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Low</p>
              <p className="text-lg font-bold">₹{currentData.low.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;
