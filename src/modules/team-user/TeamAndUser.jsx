import Heading from '@/shared/layouts/main/heading';
import { FiUsers } from 'react-icons/fi';
import { CiUser } from 'react-icons/ci';
import { PiFactoryLight } from 'react-icons/pi';
import { NavLink, useLocation } from 'react-router-dom';
import Plants from './Plants';
import Users from './Users';
import Teams from './Teams';

export default function TeamAndUser() {
  const { pathname, hash } = useLocation();
  const menus = [
    {
      title: 'Plants',
      to: '#plants',
      icon: (active) => (
        <svg
          width="24"
          height="21"
          viewBox="0 0 24 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.75 20.375H1.25C0.973858 20.375 0.75 20.1511 0.75 19.875V18.625C0.75 18.3489 0.973858 18.125 1.25 18.125H22.75C23.0261 18.125 23.25 18.3489 23.25 18.625V19.875C23.25 20.1511 23.0261 20.375 22.75 20.375Z"
            stroke={active ? '#fff' : '#0E0F0F'}
          />
          <path
            d="M21 17.5625V1.75C21 1.47386 20.7761 1.25 20.5 1.25H18.125C17.8489 1.25 17.625 1.47386 17.625 1.75V17.5625"
            stroke={active ? '#fff' : '#0E0F0F'}
          />
          <path
            d="M17.625 5.75L11.5331 3.71937C11.2093 3.61145 10.875 3.85243 10.875 4.19371V17.5625"
            stroke={active ? '#fff' : '#0E0F0F'}
          />
          <path
            d="M10.875 8L3.74807 3.92747C3.41474 3.73699 3 3.97768 3 4.36159V17.5625"
            stroke={active ? '#fff' : '#0E0F0F'}
          />
          <path
            d="M14.875 8H13.625C13.3489 8 13.125 8.22386 13.125 8.5V9.75C13.125 10.0261 13.3489 10.25 13.625 10.25H14.875C15.1511 10.25 15.375 10.0261 15.375 9.75V8.5C15.375 8.22386 15.1511 8 14.875 8Z"
            stroke={active ? '#fff' : '#0E0F0F'}
          />
          <path
            d="M7 10.25H5.75C5.47386 10.25 5.25 10.4739 5.25 10.75V12C5.25 12.2761 5.47386 12.5 5.75 12.5H7C7.27614 12.5 7.5 12.2761 7.5 12V10.75C7.5 10.4739 7.27614 10.25 7 10.25Z"
            stroke={active ? '#fff' : '#0E0F0F'}
          />
        </svg>
      ),
    },
    {
      title: 'Teams',
      to: '#teams',
      icon: (active) => (
        <svg
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M23 19V17C22.9993 16.1137 22.7044 15.2528 22.1614 14.5523C21.6184 13.8519 20.8581 13.3516 20 13.13M16 1.13C16.8604 1.3503 17.623 1.8507 18.1676 2.55231C18.7122 3.25392 19.0078 4.11683 19.0078 5.005C19.0078 5.89317 18.7122 6.75608 18.1676 7.45769C17.623 8.1593 16.8604 8.6597 16 8.88M13 5C13 7.20914 11.2091 9 9 9C6.79086 9 5 7.20914 5 5C5 2.79086 6.79086 1 9 1C11.2091 1 13 2.79086 13 5Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: 'Users',
      to: '#users',
      icon: (active) => (
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z"
            stroke={active ? '#fff' : '#0E0F0F'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const renderTab = () => {
    const components = {
      '#plants': <Plants />,
      '#teams': <Teams />,
      '#users': <Users />,
    };

    return components[hash] ?? null;
  };

  return (
    <>
      <Heading>Team & User</Heading>

      <div className="flex h-[calc(100vh-56px)]">
        <ul className="flex h-full w-56 flex-col gap-2 border-t-[1px] bg-white px-2 py-4 shadow-md">
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
        <div className="flex-1 p-6">{renderTab()}</div>
      </div>
    </>
  );
}
