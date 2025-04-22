import React from "react";


const StockPrediction = ({ stockSymbol, setStockSymbol, predictedData, predictNextDay, loading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-4">Predict Next Day's Stock Price</h2>

      {/* Input Field */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-2">Enter Stock Symbol:</label>
        <div className="flex">
          <input
            type="text"
            className="bg-gray-700 text-white p-2 rounded-l-lg w-full focus:outline-none pl-4"
            placeholder="e.g., TCS.BO"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
          />
          <button
            className="text-green-400 border-2 border-green-400 hover:bg-green-400 hover:text-gray-700 px-4 py-2 rounded-r-lg"
            onClick={predictNextDay}
          >
            Predict
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center my-4">Loading...</p>}

      {/* Prediction Results */}
      {predictedData && !loading && (
        <div className="bg-gray-700 p-4 rounded-lg mt-4 space-y-4">
          <div>
            <h3 className="font-bold text-lg">{predictedData.company} ({predictedData.stock_name})</h3>
            <p className="text-gray-400">Prediction Date: {predictedData.date}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Today's Open Price (Displayed as Predicted Open) */}
            <div>
              <p className="text-gray-400">Predicted Open</p>
              <p className="text-lg font-bold text-green-400">
                ₹{predictedData?.next_day_price?.open_price?.toFixed(2) ?? "N/A"}
              </p>
            </div>

            {/* Today's Close Price (Displayed as Predicted Close) */}
            <div>
              <p className="text-gray-400">Predicted Close</p>
              <p className="text-lg font-bold text-green-400">
                ₹{predictedData?.next_day_price?.close_price?.toFixed(2) ?? "N/A"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mt-4">Sentiment Analysis</h4>
            <p className="text-sm text-gray-400">
              Score: {predictedData?.sentiment_score?.toFixed(4) ?? "N/A"}
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-400">
                Positive: {predictedData?.sentiment_breakdown?.positive ?? "N/A"}
              </span>
              <span className="text-yellow-400">
                Neutral: {predictedData?.sentiment_breakdown?.neutral ?? "N/A"}
              </span>
              <span className="text-red-400">
                Negative: {predictedData?.sentiment_breakdown?.negative ?? "N/A"}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mt-4 mb-2">Recent News</h4>
            <ul className="space-y-2">
              {predictedData?.news?.map((article, index) => (
                <li key={index} className="border-l-4 pl-3 border-gray-600">
                  <p className="font-medium">{article.title}</p>
                  <p className="text-sm text-gray-400">
                    Source: {article.source} | Sentiment:{" "}
                    <span
                      className={
                        article.sentiment === "positive"
                          ? "text-green-400"
                          : article.sentiment === "negative"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }
                    >
                      {article.sentiment}
                    </span>{" "}
                    | Score: {article.sentiment_score?.toFixed(4) ?? "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPrediction;

