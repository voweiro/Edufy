import React from 'react';

const CartoonCharacter = ({ message, position, expression }: { message: string, position: string, expression: string }) => {
  return (
    <div className={`fixed ${position} bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 animate-bounce`}>
      <div className="text-4xl">{expression}</div>
      <div className="text-lg text-gray-800">{message}</div>
    </div>
  );
};

export default CartoonCharacter; 