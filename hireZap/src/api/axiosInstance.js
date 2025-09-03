import axios from 'axios'

const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL,
    headers : {
        'Content-Type': 'application/json'
    },
    withCredentials : true,
    timeout : 10000,
});

// request interceptor to include csrf token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = document.cookie
            .split(';')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];

        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config
    },
    (error) => Promise.reject(error)
);

// add response interceptor to hanle the token refresh and global error handling
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (!error.response){
            console.error('Server unreachable:', error.message);
            return Promise.reject({
                message: 'Server is unreachable. Please check your connection.',
                status: 'network_error'
            });
        }

        const originalRequest = error.config;
        // if the error is 401 nd we haven't trie to refresh tokken yet
        if (error.response ?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                // try to refresh the token
                await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/auth/token/refresh/`,
                    {},
                    { withCredentials: true}
                );

                // Retry the original request with the new token
                return axios(originalRequest)
                .then(response => response.data);

            } catch( refreshError){
                console.error('Token refresh failed:', refreshError)
            }
        }
        let errorMessage = 'An error occured';
        let fieldErrors = {};

        const data = error.response?.data;

        if(typeof data === 'object' && data !== null){
            fieldErrors = data;
            const nonFieldError = data?.non_field_errors?.[0];
            const emailError = data?.email?.[0];
            errorMessage = nonFieldError || emailError || error.message || errorMessage
        }
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            fieldErrors
        });
    }
);

export default axiosInstance;