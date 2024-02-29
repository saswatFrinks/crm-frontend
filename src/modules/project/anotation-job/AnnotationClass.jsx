import Box from '@/shared/icons/Box';
import React from 'react';

export default function AnnotationClass() {
  const [labelClass, setLabelClass] = React.useState([
    {
      name: 'Class 1',
      color: '#C6C4FF',
    },
    {
      name: 'Class 2',
      color: '#7DDE86',
    },
    {
      name: 'Class 3',
      color: '#FF9898',
    },
    {
      name: 'Class 4',
      color: '#9BDCFD',
    },
    {
      name: 'Class 5',
      color: '#FFD188',
    },
    {
      name: 'Class 6',
      color: '#E3E5E5',
    },
  ]);
  return (
    <div className="">
      <p className="mb-4">Click the class below to label it</p>
      <ul className="flex flex-wrap gap-4">
        {labelClass.map((t) => (
          <li
            key={t.color}
            className={`bg-[${t.color}] flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5`}
          >
            <Box size="xs" />
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
