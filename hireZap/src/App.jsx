import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes/routers';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axiosInstance from './api/axiosInstance';
import { fetchCurrentUser } from './redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { getCsrfCookie } from './redux/slices/authSlice';
import useWebSocket from './hooks/useWebSocket'; 
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);

  const { isConnected } = useWebSocket();
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("\n🔵 App initializing...");
        
        // Step 1: Get CSRF cookie
        console.log("   Step 1: Getting CSRF cookie...");
        await dispatch(getCsrfCookie()).unwrap();
        console.log("   ✅ CSRF cookie obtained");
        
        // Step 2: Check if user has access token cookie
        const hasAccessCookie = document.cookie
          .split(';')
          .some(c => c.trim().startsWith('access='));
        
        console.log(`   Step 2: Access token cookie exists? ${hasAccessCookie}`);
        
        if (hasAccessCookie && !user) {
          // User has cookie but Redux is empty (page refresh scenario)
          console.log("   Step 3: Fetching current user from JWT cookie...");
          await dispatch(fetchCurrentUser()).unwrap();
          console.log("   ✅ User fetched and Redux updated");
        }
      } catch (err) {
        console.log("   ⚠️ Auth initialization note:", err.message);
        // This is expected if user not logged in
      }
    };

    initializeAuth();
  }, [dispatch, user]);

  useEffect(() => {
    if (isConnected) {
      console.log('✅ WebSocket connected in App');
    }
  }, [isConnected]);

  const router = createBrowserRouter(routes);

  if (loading) {
    return (
      <LoadingSpinner 
        isLoading={true}
        message='Loading...'
      />
    );
  }

  return (
    <>
      <Suspense fallback={<LoadingSpinner isLoading={true} message='Loading...'/>}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer />
    </>
  );
};

export default App;
