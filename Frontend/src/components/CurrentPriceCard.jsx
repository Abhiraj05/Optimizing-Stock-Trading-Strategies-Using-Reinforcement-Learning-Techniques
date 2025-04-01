const CurrentPriceCard = ({ stockSymbol, setStockSymbol, fetchCurrentData, currentData, loading }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Get Today's Stock Price</h2>
      <div className="mb-4">
        <input
          type="text"
          className="bg-gray-700 text-white p-2 rounded-lg w-full"
          placeholder="e.g., RELIANCE.BSE"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
        />
        <button className="text-green-400 border-2 border-green-400 hover:bg-green-400 hover:text-gray-700px-4 py-2 rounded-lg" onClick={fetchCurrentData}>
          Get Today's Price
        </button>
      </div>
  
      {loading && <p>Loading...</p>}
  
      {currentData && !loading && (
        <div>
          <p>{currentData.symbol} - ₹{currentData.close.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
  
  export default CurrentPriceCard;
  