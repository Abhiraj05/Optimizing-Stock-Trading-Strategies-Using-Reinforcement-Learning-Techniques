// const HistoricalDataSection = ({ historicalData }) => (
//     <div className="bg-gray-800 p-6 rounded-lg mt-6">
//       <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
//       <table className="w-full text-left">
//         <thead>
//           <tr>
//             <th className="py-2 px-4">Date</th>
//             <th className="py-2 px-4">Close Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {historicalData.map((data, index) => (
//             <tr key={index} className={data.isPredicted ? 'text-amber-500' : ''}>
//               <td className="py-2 px-4">{data.date}</td>
//               <td className="py-2 px-4">₹{data.close.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
  
//   export default HistoricalDataSection;
  