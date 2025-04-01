export const StockMetric = ({ title, value, subValue, isPrice }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">
        {isPrice ? '$' : ''}{value}
      </div>
      {subValue && (
        <div className={`text-sm ${parseFloat(subValue) > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {parseFloat(subValue) > 0 ? '+' : ''}{subValue}
        </div>
      )}
    </div>
  );