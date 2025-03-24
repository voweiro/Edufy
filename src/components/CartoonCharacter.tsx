import React from 'react';

const CartoonCharacter = ({ message, position, expression }: { message: string, position: string, expression: string }) => {
  return (
    <div 
      className={`fixed ${position} bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center space-x-4 animate-float transform hover:scale-105 transition-all duration-300 z-50`}
    >
      <div className="relative">
        <div className="text-5xl animate-bounce">{expression}</div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <div className="text-lg font-medium text-gray-800 bg-white/50 px-4 py-2 rounded-lg">
        {message}
      </div>
    </div>
  );
};

export default CartoonCharacter; 