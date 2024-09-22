import React, { useState } from 'react';
import ChevronDown from '../icons/ChevronDown';
import ChevronUp from '../icons/ChevronUp';

const Dropdown = ({ data, onClick, selectedId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const name = data.find((c) => c.id === selectedId)?.name || 'None';

  const handleClick = (id) => {
    setIsOpen(!isOpen);
    onClick(id);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {name}
          {isOpen ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div
            className="py-1 max-h-48 overflow-y-auto"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {data.map((ele) => (
              <div
                key={ele.id}
                onClick={() => handleClick(ele.id)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
              >
                {ele.name}
              </div>
            ))}
            <div
              key="none"
              onClick={() => handleClick(-1)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              role="menuitem"
            >
              None
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
