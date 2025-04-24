import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 ">
      <ClipLoader size={90} color="white" />
    </div>
  );
};

export default Loading;
