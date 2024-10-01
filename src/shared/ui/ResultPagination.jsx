import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'react-feather';

const ResultPagination = ({ total, page, setPage }) => {
  const [paginationBar, setPaginationBar] = useState([]);
  const keyboardRef = React.useRef(null);

  // Function to update the pagination bar based on the current page
  const updatePaginationBar = (currentPage) => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(total, currentPage + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else if (end === total) {
        start = Math.max(1, end - 4);
      }
    }

    const newPaginationBar = [];
    for (let i = start; i <= end; i++) {
      newPaginationBar.push(i);
    }
    setPaginationBar(newPaginationBar);
  };

  // Handle next page click
  const handleNext = () => {
    if (page < total) {
      const newPage = page + 1;
      setPage(newPage);
      updatePaginationBar(newPage);
    }
  };

  // Handle previous page click
  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      updatePaginationBar(newPage);
    }
  };

  // Handle first page click
  const handleFirst = () => {
    setPage(1);
    updatePaginationBar(1);
  };

  // Handle last page click
  const handleLast = () => {
    setPage(total);
    updatePaginationBar(total);
  };

  useEffect(() => {
    updatePaginationBar(page);
  }, [page, total]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the control key is pressed
      if (event.ctrlKey) {
        const { handleNext, handlePrev } = keyboardRef.current;
        if (event.key === 'd') {
          event.preventDefault()
          //move backwards
          handlePrev()
        } else if (event.key === 'f') {
          event.preventDefault()
          //move forward
          handleNext()
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    keyboardRef.current = {
      handleNext,
      handlePrev
    };
  }, [handleNext, handlePrev]);

  return (
    <nav className="flex items-center">
      <ul className="mx-auto flex gap-2 rounded-full border border-gray-300 px-2 py-1.5">
        <li onClick={handleFirst} className="cursor-pointer">
          <ChevronsLeft />
        </li>
        <li onClick={handlePrev} className="cursor-pointer">
          <ChevronLeft />
        </li>
        {!paginationBar.includes(1) && <li>...</li>}
        {paginationBar.map((e) => (
          <li
            key={e}
            className={e === page ? 'font-semibold cursor-pointer' : 'text-gray-400 cursor-pointer'}
            onClick={() => setPage(e)}
          >
            {e}
          </li>
        ))}
        {!paginationBar.includes(total) && <li>...</li>}
        <li onClick={handleNext} className="cursor-pointer">
          <ChevronRight />
        </li>
        <li onClick={handleLast} className="cursor-pointer">
          <ChevronsRight />
        </li>
      </ul>
    </nav>
  );
};

export default ResultPagination;
