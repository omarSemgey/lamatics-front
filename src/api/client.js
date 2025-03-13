import axios from 'axios';

const logAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 3000
});

async function logErrorToServer(errorData){
    if (errorData.url.includes('/client-logs')) return;
    await logAxios.post('/client-logs', errorData).catch((loggingError) => {
      console.error('Logging failed (non-critical):', loggingError.message);
    })
}

function redactSensitiveData(data){
  const sensitiveKeys = ['password', 'token', 'authorization', 'credentials'];
  return JSON.parse(JSON.stringify(data), (key, value) => {
    return sensitiveKeys.includes(key.toLowerCase()) ? '***REDACTED***' : value;
  });
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve());
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isMeEndpointUnauthorized = 
      originalRequest.url.includes('/me') && 
      error.response?.status === 401;

    const errorData = {
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status || null,
      message: error.message,
      timestamp: new Date().toISOString(),
      user: localStorage.getItem('isAuthenticated') ? 'authenticated' : 'anonymous',
      path: window.location.pathname
    };

    const sanitizedError = redactSensitiveData({
      ...errorData,
      headers: originalRequest.headers,
      params: originalRequest.params,
      data: originalRequest.data
    });

    const excludedEndpoints = [
      '/auth/login',
      '/auth/refresh',
      '/auth/register',
      '/client-logs',
      '/me'
    ];

    if (!excludedEndpoints.some(path => originalRequest.url.includes(path))) {
      try {
        await logAxios.post('/client-logs', {
          ...sanitizedError,
          type: error.response?.status === 401 ? 'SECURITY_AUTH_FAILURE' : 'API_ERROR'
        });
      } catch (loggingError) {
        console.error('Failed to log error:', loggingError);
      }
    }

    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isPublicRoute = ['/', '/login', '/signup'].includes(window.location.pathname);
    if (!localStorage.getItem('isAuthenticated')) {
      return Promise.reject(error);
    }

    const excludedEndpoints = [
      '/auth/login',
      '/auth/refresh',
      '/auth/register'
    ];

    if (error.response?.status === 401 && !originalRequest._retry && !excludedEndpoints.some(path => originalRequest.url.includes(path))) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/auth/refresh')
        localStorage.setItem('isAuthenticated',true)
        processQueue();
        return axios(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('isAuthenticated')
        processQueue(refreshError);
        if (!isPublicRoute) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;