import {useCallback} from 'react';
import axios from 'axios';

import {useUser} from '../Context/user-context';

const AUTH_COOKIES = ['auth_status', 'auth_user', 'connect.sid', 'boptest-session'];

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const clearAuthCookies = () => {
  AUTH_COOKIES.forEach(deleteCookie);
};

export const useLogout = () => {
  const {setDisplayName} = useUser();

  return useCallback(() => {
    clearAuthCookies();

    axios
      .post('/api/auth/logout')
      .then(() => {
        console.log('Server logout successful');
      })
      .catch(err => {
        console.log('Server logout failed:', err);
      })
      .finally(() => {
        setDisplayName('');
        window.location.href = '/?logged_out=' + new Date().getTime();
      });
  }, [setDisplayName]);
};
