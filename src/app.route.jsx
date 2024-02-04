import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './shared/ui/ErrorBoundary';
import { Suspense } from 'react';
import Register from '@/modules/auth/register/Register';
import Login from '@/modules/auth/login/Login';
import { Toaster } from 'react-hot-toast';

export default function AppRoutes() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={'...Loading'}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}
