import React from 'react';
import '@/shared/styles/loader.css';

export default function ProjectCreateLoader({
  title = 'Creating your project ...',
}) {
  return (
    <div className="fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center bg-gray-200/75">
      <div className="loader">
        <label>{title}</label>
        <div className="loading"></div>
      </div>
    </div>
  );
}
