import Analytic from './modules/analytics/Analytic';
import Login from './modules/auth/login';
import Register from './modules/auth/register';
import Home from './modules/project';
import Lisence from './modules/lisence';
import TeamAndUser from './modules/team-user';
import MainLayout from './shared/layouts/main';

import { createBrowserRouter } from 'react-router-dom';
import { projectRouter } from './modules/project/project.route';
import Magic from './modules/magic';
import ResetPassword from './modules/auth/reset-password';
import ForgotPassword from './modules/auth/forgot-password';

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
    path: 'magic/:id',
    element: <Magic />,
  },
  {
    path: 'reset-password/:magicId',
    element: <ResetPassword />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
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
  projectRouter,
]);

export default router;
