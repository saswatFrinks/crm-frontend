import storageService from '@/core/storage';
import ChevronUp from '../icons/ChevronUp';
import Label from './Label';
import { useState } from 'react';
import ChevronDown from '../icons/ChevronDown';
// import User from '../icons/User';
import Logout from '../icons/Logout';
import { TOKEN } from '@/core/constants';
import { useNavigate } from 'react-router-dom';
import { removeCookie } from '../hocs/withAuthenticated';
export default function UserDropdown() {
  const name = JSON.parse(storageService.get('user'))?.name;
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => {
    setOpenDropdown(prev => !prev);
  }

  const handleLogout = () => {
    removeCookie();
    navigate('/login')
  }

  const dropdownMenu = [
    // {
    //   title: 'Account',
    //   icon: <User />
    // },
    {
      title: 'Log Out',
      icon: <Logout />,
      onClick: handleLogout
    }
  ]

  return (
    <div className="flex flex-col" style={{width: '100%'}}>
      {openDropdown && (
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 m-2 overflow-hidden">
          {dropdownMenu.map(item => (
            <div 
              className="flex items-center justify-start gap-4 py-2 px-4 cursor-pointer hover:bg-gray-200" 
              style={{width: '100%'}}
              onClick={item.onClick}
            >
              {item.icon}
              {item.title}
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full cursor-pointer items-center justify-between gap-4 px-2" onClick = {toggleOpen}>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 font-semibold">
          {name ? name[0].toUpperCase() : ''}
        </div>
        <div className="whitespace-nowrap grow">{name}</div>
        {openDropdown ? <ChevronDown /> : <ChevronUp />}
      </div>
    </div>
  );
}
