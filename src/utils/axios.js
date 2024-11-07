// import axios from 'axios';

// import { HOST_API } from 'src/config-global';

// // ----------------------------------------------------------------------

// const axiosInstance = axios.create({ baseURL: HOST_API });

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
// );

// export default axiosInstance;

// // ----------------------------------------------------------------------

// export const fetcher = async (args) => {
//   const [url, config] = Array.isArray(args) ? args : [args];

//   const res = await axiosInstance.get(url, { ...config });

//   return res.data;
// };

// // ----------------------------------------------------------------------

// export const endpoints = {
//   chat: '/api/chat',
//   kanban: '/api/kanban',
//   calendar: '/api/calendar',
//   auth: {
//     me: '/api/auth/profile/',
//     login: '/api/auth/login/',
//     register: '/api/auth/register/',
//   },
//   mail: {
//     list: '/api/mail/list',
//     details: '/api/mail/details',
//     labels: '/api/mail/labels',
//   },
//   post: {
//     list: '/api/post/list',
//     details: '/api/post/details',
//     latest: '/api/post/latest',
//     search: '/api/post/search',
//   },
//   product: {
//     list: '/api/product/list',
//     details: '/api/product/details',
//     search: '/api/product/search',
//   },
// };


import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ 
  baseURL: HOST_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${HOST_API}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access: newAccessToken } = response.data;
          sessionStorage.setItem('accessToken', newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/profile/',
    login: '/api/auth/login/',
    register: '/api/auth/register/',
    profile: '/api/auth/profile/',
    changePassword: '/api/auth/profile/change-password/',
    logout: '/api/auth/logout/',
    refresh: '/api/auth/token/refresh/',
    updateProfileImage: '/api/auth/profile/update-image/',

  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  quickPortfolio: '/api/quick-portfolio/',
  portfolio: {
  list: '/api/portfolios/',
},
};

// Optional: Add custom request helpers
export const uploadFile = async (url, file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const multipartRequest = async (url, data, method = 'POST') => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  return axiosInstance({
    method,
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};