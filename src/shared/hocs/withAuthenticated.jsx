import { TOKEN } from '@/core/constants';
import storageService from '@/core/storage';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const navigate = useNavigate();

    React.useEffect(() => {
      const token = getCookie();
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export const getCookie = () => {
  const cookieName = `${TOKEN}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
          return cookie.substring(cookieName.length, cookie.length);
      }
  }
  return null;
}

export const removeCookie = () => {
  document.cookie = `${TOKEN}=;path=/`
}

export default withAuth;
