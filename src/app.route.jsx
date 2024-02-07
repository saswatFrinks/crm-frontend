import Analytic from './modules/analytics/Analytic';
import Login from './modules/auth/login/Login';
import Register from './modules/auth/register/Register';
import Home from './modules/home/Home';
import Lisence from './modules/lisence/Lisence';
import TeamAndUser from './modules/team-user/TeamAndUser';
import MainLayout from './shared/layouts/main/main-layout';

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'teams-users',
        element: <TeamAndUser />,
      },
      {
        path: 'analytics',
        element: <Analytic />,
      },
      {
        path: 'lisence-payments',
        element: <Lisence />,
      },
    ],
  },
]);

export default router;
