import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'react-feather';

export default function Pagination() {
  return (
    <nav className="flex items-center ">
      <ul className="mx-auto flex gap-2 rounded-full border border-gray-300 px-2 py-1.5">
        <li>
          <ChevronsLeft />
        </li>
        <li>
          <ChevronLeft />
        </li>
        <li className="text-gray-400">1</li>
        <li className="text-gray-400">2</li>
        <li className="font-semibold text-black">3</li>
        <li className="text-gray-400">...</li>
        <li className="text-gray-400">10</li>
        <li className="text-gray-400">11</li>
        <li>
          <ChevronRight />
        </li>
        <li>
          <ChevronsRight />
        </li>
      </ul>
    </nav>
  );
}
