import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StockChart = ({ historicalData, predictedNextDay }) => {
  // Map historical data to the format required for the chart
  const chartData = historicalData.map((item) => ({
    date: item.date,
    open: item.open,
    close: item.close,
  }));

  // If predicted data exists, add it as the last data point
  if (predictedNextDay) {
    chartData.push({
      date: "Predicted Value for Next Day",  // Change X-axis label to 'Predicted Value for Next Day'
      open: predictedNextDay.open_price,
      close: predictedNextDay.close_price,
    });
  }

  // Function to format the Y-axis price labels as ₹ (currency)
  const formatYAxisPrice = (value) => {
    return `₹${value.toLocaleString()}`; // Formats the value with ₹ and adds commas for thousands
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-white mt-10">
      <h2 className="text-xl font-semibold mb-4">Stock Price Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" tickFormatter={formatYAxisPrice} /> {/* Custom Y-Axis Formatting */}
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} /> {/* Format Tooltip */}
          <Legend />
          <Line type="monotone" dataKey="open" stroke="#8884d8" name="Open Price" />
          <Line type="monotone" dataKey="close" stroke="#82ca9d" name="Close Price" />
          
          {/* Add predicted lines for next day's open and close values */}
          {predictedNextDay && (
            <>
              <Line
                type="monotone"
                dataKey="open"
                stroke="#FF5733"
                name="Predicted Open"
                dot={{ stroke: '#FF5733', strokeWidth: 2, r: 4 }} // Adding a distinct color and dot for predicted open
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#FF6F61"
                name="Predicted Close"
                dot={{ stroke: '#FF6F61', strokeWidth: 2, r: 4 }} // Adding a distinct color and dot for predicted close
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>

      {predictedNextDay && (
        <div className="mt-4 text-sm text-gray-300">
          <p><strong>Predicted Values:</strong></p>
          <p>Open: ₹{predictedNextDay.open_price}</p>
          <p>Close: ₹{predictedNextDay.close_price}</p>
        </div>
      )}
    </div>
  );
};

export default StockChart;
