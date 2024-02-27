import { TOKEN } from '@/core/constants';
import storageService from '@/core/storage';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const navigate = useNavigate();

    React.useEffect(() => {
      const token = storageService.get(TOKEN);
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
