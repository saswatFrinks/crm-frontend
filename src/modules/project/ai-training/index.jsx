import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import React from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import Assembly from './assembly';
import Dimensioning from './dimensioning';
import Cosmetic from './cosmetic';

export default function AiTraining() {
  const params = useParams();

  const { hash } = useLocation();

  const menus = [
    {
      title: 'Assembly',
      to: '#assembly',
      icon: (active) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 13.6582V22.0003C1.5 22.2765 1.72386 22.5003 2 22.5003H10.3421V20.2898L11.1384 19.4935C11.9195 18.7124 11.9195 17.4461 11.1384 16.665L10.3421 15.8687V13.6582H8.13158L7.33527 14.4545C6.55422 15.2356 5.28789 15.2356 4.50684 14.4545L3.71053 13.6582H1.5Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
          />
          <path
            d="M10.3423 1.5L2.00018 1.5C1.72404 1.5 1.50018 1.72386 1.50018 2V10.3421H3.71071L4.50702 11.1384C5.28807 11.9195 6.5544 11.9195 7.33545 11.1384L8.13176 10.3421H10.3423V8.13158L9.54597 7.33527C8.76492 6.55422 8.76492 5.28789 9.54597 4.50684L10.3423 3.71053V1.5Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
          />
          <path
            d="M22.5 10.3418V1.99969C22.5 1.72355 22.2761 1.49969 22 1.49969H13.6579V3.71022L12.8616 4.50653C12.0805 5.28758 12.0805 6.55391 12.8616 7.33496L13.6579 8.13127V10.3418H15.8684L16.6647 9.54548C17.4458 8.76444 18.7121 8.76443 19.4932 9.54548L20.2895 10.3418H22.5Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
          />
          <path
            d="M13.6577 22.5H21.9998C22.276 22.5 22.4998 22.2761 22.4998 22V13.6579H20.2893L19.493 12.8616C18.7119 12.0805 17.4456 12.0805 16.6646 12.8616L15.8682 13.6579H13.6577V15.8684L14.454 16.6647C15.2351 17.4458 15.2351 18.7121 14.454 19.4932L13.6577 20.2895V22.5Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: 'Dimensioning',
      to: '#dimensioning',
      icon: (active) => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.1667 1.5V15.5M20.1667 1.5L17.8333 3.83333M20.1667 1.5L22.5 3.83333M20.1667 15.5L17.8333 13.1667M20.1667 15.5L22.5 13.1667M1.5 20.1667H15.5M1.5 20.1667L3.83333 17.8333M1.5 20.1667L3.83333 22.5M15.5 20.1667L13.1667 17.8333M15.5 20.1667L13.1667 22.5M2 15.5H15C15.2761 15.5 15.5 15.2761 15.5 15V2C15.5 1.72386 15.2761 1.5 15 1.5H2C1.72386 1.5 1.5 1.72386 1.5 2V15C1.5 15.2761 1.72386 15.5 2 15.5Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: 'Cosmetic',
      to: '#cosmetic',
      icon: (active) => (
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.2381 14.3333L9.13923 11.4322C9.62294 10.9485 10.3925 10.9045 10.9282 11.3299V11.3299C11.5218 11.8013 12.3874 11.6898 12.8422 11.0834L15.7619 7.19048M21 6V16C21 18.7614 18.7614 21 16 21H6C3.23858 21 1 18.7614 1 16V6C1 3.23858 3.23858 1 6 1H16C18.7614 1 21 3.23858 21 6Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const renderTab = () => {
    const components = {
      '#assembly': <Assembly />,
      '#dimensioning': <Dimensioning />,
      '#cosmetic': <Cosmetic />,
    };

    return components[hash] ?? null;
  };

  return (
    <>
      {' '}
      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Project Name</span>
            </Link>
          </>
        }
      >
        Project
      </Heading>
      <div className="flex h-[calc(100vh-56px)]">
        <ul className="flex h-full w-56  flex-col gap-2 border-t-[1px] bg-white px-2 py-8 shadow-md">
          {menus.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                className={({ isActive }) => {
                  const clx =
                    t.to == hash
                      ? 'active bg-f-primary text-white hover:bg-f-primary hover:text-white'
                      : 'hover:bg-gray-100';
                  return `${clx} flex items-center gap-4 rounded-md px-2 py-2 duration-100 hover:text-black`;
                }}
              >
                <div className="flex w-6 items-center justify-center">
                  {t.icon(hash == t.to)}
                </div>
                <span>{t.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex-1 px-10 py-8">{renderTab()}</div>
      </div>
    </>
  );
}
