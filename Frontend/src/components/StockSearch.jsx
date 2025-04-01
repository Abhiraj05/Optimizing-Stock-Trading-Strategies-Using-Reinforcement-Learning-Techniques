import React from "react";
import { Search } from "lucide-react";

const StockSearch = ({ stockSymbol, setStockSymbol, suggestions, showSuggestions, handleSelectStock }) => {
  return (
    <div className="mb-8 relative">
      <div className="flex items-center bg-gray-800 rounded-lg p-2">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          className="bg-transparent border-none outline-none flex-grow text-white placeholder-gray-400"
          placeholder="Search BSE stock symbol or company name..."
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          onFocus={() => stockSymbol.length > 1 && showSuggestions(true)}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 bg-gray-800 w-full mt-1 rounded-lg shadow-lg">
          {suggestions.map((stock) => (
            <div 
              key={stock.symbol} 
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelectStock(stock)}
            >
              <div className="font-bold">{stock.symbol}</div>
              <div className="text-sm text-gray-400">{stock.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
