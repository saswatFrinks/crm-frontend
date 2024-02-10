import React from 'react';
import logo from '@/assets/logo.svg';
import { Link, NavLink } from 'react-router-dom';
import { IoGridOutline } from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi';
import { FiBarChart2 } from 'react-icons/fi';
import { TfiMoney } from 'react-icons/tfi';
import UserDropdown from '@/shared/ui/UserDropdown';

export default function Sidebar() {
  const menus = [
    {
      title: 'Projects',
      to: '/',
      icon: IoGridOutline,
    },
    {
      title: 'Teams & Users',
      to: '/teams-users',
      icon: FiUsers,
    },
    {
      title: 'Analytics',
      to: '/analytics',
      icon: FiBarChart2,
    },
    {
      title: 'Lisence & Payments',
      to: '/lisence-payments',
      icon: TfiMoney,
    },
  ];

  return (
    <div className="fixed left-0 top-0 flex h-screen  w-64 flex-col items-center  px-2 py-4 shadow-md">
      <Link to="/" className="mb-8">
        <img src={logo} alt="frink logo" width={200} />
      </Link>

      <ul className="flex h-full w-full flex-col gap-2">
        {menus.map((t) => (
          <li key={t.to}>
            <NavLink
              to={t.to}
              className={({ isActive }) => {
                const clx = isActive
                  ? 'active bg-f-primary text-white hover:bg-f-primary hover:text-white'
                  : 'hover:bg-gray-100 ';
                return `${clx} flex items-center gap-2 rounded-md px-2 py-2 duration-100 hover:text-black`;
              }}
            >
              <t.icon /> <span>{t.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <UserDropdown />
    </div>
  );
}
