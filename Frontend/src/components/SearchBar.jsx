// import { Search } from 'lucide-react';

// export const SearchBar = ({ value, onChange }) => (
//   <div className="relative">
//     <input
//       type="text"
//       placeholder="Search stocks..."
//       value={value}
//       onChange={onChange}
//       className="w-full p-4 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//     <Search className="absolute left-4 top-4 text-gray-400" size={20} />
//   </div>
// );


import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

 const SearchBar = ({ stockSymbol, setStockSymbol, handleSelectStock }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const stockSuggestions = [
    { symbol: 'RELIANCE.BSE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY.BSE', name: 'Infosys Ltd.' },
    { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank Ltd.' },
  ];

  useEffect(() => {
    if (stockSymbol.length > 1) {
      const filtered = stockSuggestions.filter(
        stock => stock.symbol.toLowerCase().includes(stockSymbol.toLowerCase()) || 
                stock.name.toLowerCase().includes(stockSymbol.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [stockSymbol]);

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
          onFocus={() => stockSymbol.length > 1 && setShowSuggestions(true)}
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


export  default SearchBar;