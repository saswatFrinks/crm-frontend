import logo from '@/assets/logo.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import UserDropdown from '@/shared/ui/UserDropdown';

export default function Sidebar() {
  const { pathname } = useLocation();

  const menus = [
    {
      title: 'Projects',
      to: '/',
      pathname: '/',
      icon: (active) => (
        <svg
          className={`${active ? 'text-white' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="6.66667"
            height="6.66667"
            rx="2"
            fill={`${active ? '#fff' : '#0E0F0F'}`}
          />
          <rect
            x="9.33301"
            width="6.66667"
            height="6.66667"
            rx="2"
            fill={`${active ? '#fff' : '#0E0F0F'}`}
          />
          <rect
            y="9.33325"
            width="6.66667"
            height="6.66667"
            rx="2"
            fill={`${active ? '#fff' : '#0E0F0F'}`}
          />
          <rect
            x="9.33301"
            y="9.33325"
            width="6.66667"
            height="6.66667"
            rx="2"
            fill={`${active ? '#fff' : '#0E0F0F'}`}
          />
        </svg>
      ),
    },
    {
      title: 'Teams & Users',
      to: '/teams-users#plants',
      pathname: '/teams-users',
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
            stroke={`${active ? '#fff' : '#0E0F0F'}`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: 'Analytics',
      to: '/analytics',
      pathname: '/analytics',
      icon: (active) => (
        <svg
          width="14"
          height="18"
          viewBox="0 0 14 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 17V7M7 17V1M1 17V11"
            stroke={`${active ? '#fff' : '#0E0F0F'}`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: 'Lisence & Payments',
      to: '/lisence-payments',
      pathname: '/lisence-payments',
      icon: (active) => (
        <svg
          width="14"
          height="24"
          viewBox="0 0 14 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1V23M12 5H4.5C3.57174 5 2.6815 5.36875 2.02513 6.02513C1.36875 6.6815 1 7.57174 1 8.5C1 9.42826 1.36875 10.3185 2.02513 10.9749C2.6815 11.6313 3.57174 12 4.5 12H9.5C10.4283 12 11.3185 12.3687 11.9749 13.0251C12.6313 13.6815 13 14.5717 13 15.5C13 16.4283 12.6313 17.3185 11.9749 17.9749C11.3185 18.6313 10.4283 19 9.5 19H1"
            stroke={`${active ? '#fff' : '#0E0F0F'}`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  
  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col items-center  px-2 py-4 shadow-md">
      <Link to="/" className="mb-8">
        <img src={logo} alt="frink logo" width={200} />
      </Link>

      <ul className="mt-8 flex h-full w-full flex-col gap-2">
        {menus.map((t) => (
          <li key={t.to}>
            <NavLink
              to={t.to}
              className={({ isActive }) => {
                const clx = isActive
                  ? 'active bg-f-primary text-white hover:bg-f-primary hover:text-white'
                  : 'hover:bg-gray-100 ';
                return `${clx} flex items-center gap-4 rounded-md px-2 py-2 duration-100 hover:text-black`;
              }}
            >
              <div className="flex w-6 items-center justify-center">
                {t.icon(pathname == t.pathname)}
              </div>
              <span>{t.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <UserDropdown />
    </div>
  );
}
