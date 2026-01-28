
import axios from 'axios';

const setupInterceptors = () => {
    // Axios Interceptor
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Check if it's strictly a token issue or general unauthorized
                // For safety, log out on 401
                localStorage.removeItem('user-info');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    // Fetch Interceptor
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        try {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                localStorage.removeItem('user-info');
                window.location.href = '/login';
            }
            return response;
        } catch (error) {
            throw error;
        }
    };
};

export default setupInterceptors;
