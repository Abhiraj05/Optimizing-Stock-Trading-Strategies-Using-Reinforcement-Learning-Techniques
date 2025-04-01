import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { StockChart } from './StockChart';
import { StockMetric } from './StockMetric';

export const StockAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const stockData = [
    { date: '2025-01', price: 150 },
    { date: '2025-02', price: 155 },
    { date: '2025-03', price: 148 },
    { date: '2025-04', price: 160 },
    { date: '2025-05', price: 165 },
  ];

  const stockDetails = {
    symbol: 'Reliance',
    name: 'Reliance Industries Ltd',
    currentPrice: 1266.50,
    change: '+2.45',
    changePercent: '+1.51',
    marketCap: '2.8T',
    volume: '52.3M',
  };

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <StockChart data={stockData} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StockMetric 
            title="Current Price"
            value={stockDetails.currentPrice}
            subValue={`${stockDetails.change} (${stockDetails.changePercent}%)`}
            isPrice
          />
          <StockMetric 
            title="Market Cap"
            value={stockDetails.marketCap}
          />
          <StockMetric 
            title="Volume"
            value={stockDetails.volume}
          />
          <StockMetric 
            title="Symbol"
            value={stockDetails.symbol}
            subValue={stockDetails.name}
          />
        </div>
      </div>
    </main>
  );
};
