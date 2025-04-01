import React from 'react';

const StockCard = ({ title, stockData, loading, fetchStockData }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg mb-4" onClick={fetchStockData}>
        Fetch Data
      </button>

      {loading && <p className="text-center my-4">Loading...</p>}

      {stockData && !loading && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-lg">{stockData.symbol}</h3>
          <p className="text-gray-400">{stockData.date}</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-400">Open</p>
              <p className="text-lg font-bold">₹{stockData.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Close</p>
              <p className="text-lg font-bold">₹{stockData.close.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">High</p>
              <p className="text-lg font-bold">₹{stockData.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Low</p>
              <p className="text-lg font-bold">₹{stockData.low.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;
