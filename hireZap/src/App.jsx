import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes/routers';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axiosInstance from './api/axiosInstance';
import { fetchCurrentUser } from './redux/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance.get('/auth/csrf-cookie/').then(() => {
      const accessCookie = document.cookie.split(';').find(c => c.trim().startsWith('access='));
      if (accessCookie) dispatch(fetchCurrentUser());
    });
  }, [dispatch]);

  const router = createBrowserRouter(routes);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer />
    </>
  );
};

export default App;
