export const stockSuggestions = [
    { symbol: 'RELIANCE.BSE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY.BSE', name: 'Infosys Ltd.' },
    { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank Ltd.' },
  ];
  
  export const getMockCurrentData = (stockSymbol) => ({
    symbol: stockSymbol,
    date: new Date().toLocaleDateString(),
    open: 2145.75,
    high: 2167.30,
    low: 2138.45,
    close: 2160.80,
    volume: 1542678
  });
  
  export const getMockPredictedData = (stockSymbol) => ({
    symbol: stockSymbol,
    date: new Date(new Date().getTime() + 86400000).toLocaleDateString(),
    predictedOpen: 2165.20,
    predictedClose: 2178.45,
    confidence: 0.85
  });
  
  export const getMockHistoricalData = () => {
    const today = new Date();
    const mockHistorical = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today.getTime() - (i * 86400000));
      mockHistorical.push({
        date: date.toLocaleDateString(),
        close: 2000 + Math.random() * 200,
      });
    }
  
    mockHistorical.push({
      date: new Date(today.getTime() + 86400000).toLocaleDateString(),
      close: 2178.45,
      isPredicted: true
    });
  
    return mockHistorical;
  };
  