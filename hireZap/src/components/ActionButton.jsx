import React from 'react';

const ActionButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
    >
      {text}
    </button>
  );
};

export default ActionButton;
