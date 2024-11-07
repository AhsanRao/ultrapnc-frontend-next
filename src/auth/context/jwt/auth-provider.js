// 'use client';

// import PropTypes from 'prop-types';
// import { useMemo, useEffect, useReducer, useCallback } from 'react';

// import axios, { endpoints } from 'src/utils/axios';

// import { AuthContext } from './auth-context';
// import { setSession, isValidToken } from './utils';


// const initialState = {
//   user: null,
//   loading: true,
// };

// const reducer = (state, action) => {
//   if (action.type === 'INITIAL') {
//     return {
//       loading: false,
//       user: action.payload.user,
//     };
//   }
//   if (action.type === 'LOGIN') {
//     return {
//       ...state,
//       user: action.payload.user,
//     };
//   }
//   if (action.type === 'REGISTER') {
//     return {
//       ...state,
//       user: action.payload.user,
//     };
//   }
//   if (action.type === 'LOGOUT') {
//     return {
//       ...state,
//       user: null,
//     };
//   }
//   return state;
// };

// // ----------------------------------------------------------------------

// const STORAGE_KEY = 'accessToken';

// export function AuthProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const initialize = useCallback(async () => {
//     try {
//       const accessToken = sessionStorage.getItem(STORAGE_KEY);

//       if (accessToken && isValidToken(accessToken)) {
//         setSession(accessToken);

//         const response = await axios.get(endpoints.auth.me);

//         const { user } = response.data;

//         dispatch({
//           type: 'INITIAL',
//           payload: {
//             user: {
//               ...user,
//               accessToken,
//             },
//           },
//         });
//       } else {
//         dispatch({
//           type: 'INITIAL',
//           payload: {
//             user: null,
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch({
//         type: 'INITIAL',
//         payload: {
//           user: null,
//         },
//       });
//     }
//   }, []);

//   useEffect(() => {
//     initialize();
//   }, [initialize]);

//   // LOGIN
//   const login = useCallback(async (email, password) => {
//     const data = {
//       email,
//       password,
//     };

//     const response = await axios.post(endpoints.auth.login, data);

//     const { accessToken, user } = response.data;
//     setSession(accessToken);

//     dispatch({
//       type: 'LOGIN',
//       payload: {
//         user: {
//           ...user,
//           accessToken,
//         },
//       },
//     });
//   }, []);

//   // REGISTER
//   const register = useCallback(async (email, password, firstName, lastName, username) => {
//     const data = {
//       email,
//       password,
//       firstName,
//       lastName,
//       username,
//     };

//     const response = await axios.post(endpoints.auth.register, data);

//     const { accessToken, user } = response.data;

//     sessionStorage.setItem(STORAGE_KEY, accessToken);

//     dispatch({
//       type: 'REGISTER',
//       payload: {
//         user: {
//           ...user,
//           accessToken,
//         },
//       },
//     });
//   }, []);

//   // LOGOUT
//   const logout = useCallback(async () => {
//     setSession(null);
//     dispatch({
//       type: 'LOGOUT',
//     });
//   }, []);

//   // ----------------------------------------------------------------------

//   const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

//   const status = state.loading ? 'loading' : checkAuthenticated;

//   const memoizedValue = useMemo(
//     () => ({
//       user: state.user,
//       method: 'jwt',
//       loading: status === 'loading',
//       authenticated: status === 'authenticated',
//       unauthenticated: status === 'unauthenticated',
//       //
//       login,
//       register,
//       logout,
//     }),
//     [login, logout, register, state.user, status]
//   );

//   return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
// }

// AuthProvider.propTypes = {
//   children: PropTypes.node,
// };


// AuthProvider.js

'use client';

import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  if (action.type === 'UPDATE_PROFILE') {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.payload.user,
      },
    };
  }
  return state;
};

const STORAGE_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const response = await axios.get(endpoints.auth.profile);
        const { user } = response.data;
        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const response = await axios.post(endpoints.auth.login, {
      email,
      password,
    });
    const { accessToken, user } = response.data;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
    console.log(data);
    const response = await axios.post(endpoints.auth.register, data);
    const { accessToken, user } = response.data;
    sessionStorage.setItem(STORAGE_KEY, accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // UPDATE PROFILE
  const updateProfile = useCallback(async (data) => {
    const response = await axios.put(endpoints.auth.profile, data);
    const { user } = response.data;
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        user,
      },
    });
    return response.data;
  }, []);

  // CHANGE PASSWORD
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    const response = await axios.post(endpoints.auth.changePassword, {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    try {
      await axios.post(endpoints.auth.logout, {
        refresh: refreshToken,
      });
    } catch (error) {
      console.error(error);
    }
    setSession(null);
    sessionStorage.removeItem(REFRESH_KEY);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }),
    [login, logout, register, updateProfile, changePassword, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};