import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('🍪 All cookies:', document.cookie);
        const csrfToken = document.cookie
            .split(';')
            .find(row => row.trim().startsWith('csrftoken='))  // ✅ Added trim()
            ?.split('=')[1];

        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        const hasAccess = document.cookie.includes('access=');
        const hasRefresh = document.cookie.includes('refresh=');
        console.log('🔑 Has access cookie:', hasAccess);
        console.log('🔑 Has refresh cookie:', hasRefresh);
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        console.error('❌ Response error:', error.response?.status, error.config?.url);
        
        if (!error.response) {
            console.error('Server unreachable:', error.message);
            return Promise.reject({
                message: 'Server is unreachable. Please check your connection.',
                status: 'network_error'
            });
        }

        const originalRequest = error.config;
        const url = originalRequest.url || '';
        
        const isAuthEndpoint = 
            url.includes('/auth/login') ||
            url.includes('/auth/register') || 
            url.includes('/auth/register-otp') || 
            url.includes('/auth/token/refresh');

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                console.log('🔄 Attempting token refresh...');
                
                // Check if refresh cookie exists
                const refreshCookie = document.cookie
                    .split(';')
                    .find(c => c.trim().startsWith('refresh='));
                
                if (!refreshCookie) {
                    console.error('❌ No refresh token found');
                    throw new Error('No refresh token');
                }

                // ✅ Use axios directly (not axiosInstance) to avoid infinite loop
                const csrfToken = document.cookie
                    .split(';')
                    .find(row => row.trim().startsWith('csrftoken='))
                    ?.split('=')[1];

                await axios.post(
                    '/api/auth/token/refresh/',
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfToken || ''  // ✅ Include CSRF token
                        }
                    }
                );

                console.log('✅ Token refreshed successfully');

                // ✅ Retry original request with axiosInstance
                return axiosInstance.request(originalRequest);

            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                
                // Clear auth state and redirect to login
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
                
                return Promise.reject({
                    message: 'Session expired. Please login again.',
                    status: 401
                });
            }
        }

        // Handle other errors
        let errorMessage = 'An error occurred';
        let fieldErrors = {};
        const data = error.response?.data;

        if (typeof data === 'object' && data !== null) {
            fieldErrors = data;
            const nonFieldError = data?.non_field_errors?.[0] || data?.detail;
            const emailError = data?.email?.[0];
            errorMessage = nonFieldError || emailError || error.message || errorMessage;
        }

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            fieldErrors
        });
    }
);

export default axiosInstance;