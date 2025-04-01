import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StockChart = ({ historicalData }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Price History & Prediction</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" tick={{ fill: "#aaa" }} />
            <YAxis tick={{ fill: "#aaa" }} />
            <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#FFD700" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
