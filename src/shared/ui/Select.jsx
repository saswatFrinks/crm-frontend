import React from 'react';

export default function Select(props) {
  const { options = [] } = props;
  return (
    <select className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-f-primary focus:ring-f-primary focus-visible:border-f-primary focus-visible:outline-f-primary">
      {options.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
