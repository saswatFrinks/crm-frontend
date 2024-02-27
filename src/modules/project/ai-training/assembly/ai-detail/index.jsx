import ArrowRight from '@/shared/icons/ArrowRight';

import { NavLink, useLocation } from 'react-router-dom';
import Result from './Result';
import Detail from './Detail';

export default function AIDetail() {
  const { hash } = useLocation();

  const tabs = [
    {
      title: 'Training Results',
      fragment: '#result',
    },
    {
      title: 'Model Details',
      fragment: '#detail',
    },
  ];

  const tabObj = {
    '#result': <Result />,
    '#detail': <Detail />,
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-2xl font-semibold">AI Models</h1> <ArrowRight />{' '}
        <span>Model 1234</span>
      </div>

      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          {tabs.map((t) => (
            <li key={t.fragment} className="me-2">
              <NavLink
                to={t.fragment}
                className={`${hash == t.fragment ? 'border-f-primary hover:border-f-primary' : 'border-transparent hover:border-gray-300'} inline-block rounded-t-lg border-b-2  p-4  hover:text-gray-600 dark:hover:text-gray-300`}
              >
                {t.title}{' '}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">{tabObj[hash]}</div>
    </>
  );
}
