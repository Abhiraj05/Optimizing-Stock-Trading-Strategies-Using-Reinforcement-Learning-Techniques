const PredictionCard = ({ stockSymbol, predictNextDay, predictedData, loading }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Predict Next Day Price</h2>
      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg" onClick={predictNextDay}>
        Predict Price
      </button>
  
      {loading && <p>Loading prediction...</p>}
  
      {predictedData && !loading && (
        <div className="mt-4">
          <p>{predictedData.symbol} - Predicted Close: ₹{predictedData.predictedClose.toFixed(2)}</p>
          <p>Confidence: {(predictedData.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
  
  export default PredictionCard;
  