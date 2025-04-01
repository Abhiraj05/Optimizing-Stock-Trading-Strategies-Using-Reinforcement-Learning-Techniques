import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const HistoricalChart = ({ historicalData }) => {
  const chartData = {
    labels: historicalData.map(data => data.date),
    datasets: [
      {
        label: 'Stock Price',
        data: historicalData.map(data => data.close),
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Historical Price Chart</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HistoricalChart;
