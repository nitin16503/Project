import React from 'react';



const ErrorComponent: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen w-screen text-black">
      <div className="p-8 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );    
};

export default ErrorComponent;
