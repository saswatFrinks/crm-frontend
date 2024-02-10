import Heading from '@/shared/layouts/main/heading';
import { FiUsers } from 'react-icons/fi';
import { CiUser } from 'react-icons/ci';
import { PiFactoryLight } from 'react-icons/pi';
import { NavLink, useLocation } from 'react-router-dom';
import Plants from './Plants';
import Users from './Users';
import Teams from './Teams';

export default function TeamAndUser() {
  const location = useLocation();
  console.log(location.hash);
  const menus = [
    {
      title: 'Plants',
      to: '#plants',
      icon: PiFactoryLight,
    },
    {
      title: 'Teams',
      to: '#teams',
      icon: FiUsers,
    },
    {
      title: 'Users',
      to: '#users',
      icon: CiUser,
    },
  ];

  const renderTab = () => {
    const components = {
      '#plants': <Plants />,
      '#teams': <Teams />,
      '#users': <Users />,
    };
    return components[location.hash] ?? null;
  };

  return (
    <>
      <Heading>TeamAndUser</Heading>
      <div className="h-[calc(100vh-56px)] flex">
        <ul className="flex h-full w-52 flex-col gap-2 border-t-[1px] bg-white p-4 shadow-md">
          {menus.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                className={({ isActive }) => {
                  const clx =
                    t.to == location.hash
                      ? 'active bg-f-primary text-white hover:bg-f-primary hover:text-white'
                      : 'hover:bg-gray-100';
                  return `${clx} flex items-center gap-2 rounded-md px-2 py-2 duration-100 hover:text-black`;
                }}
              >
                <t.icon /> <span>{t.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-6 flex-1">{renderTab()}</div>
      </div>
    </>
  );
}
