import React, {useEffect} from 'react';
import axios from 'axios';

export const UserContext = React.createContext({
  authedEmail: '',
  authedName: '',
  setAuthedEmail: (email: string) => {},
  setAuthedName: (name: string) => {},
});

const useUser = () => React.useContext(UserContext);

type Props = {
  children: React.ReactNode;
};

const UserProvider = ({children}: Props) => {
  const [authedEmail, setAuthedEmail] = React.useState('');
  const [authedName, setAuthedName] = React.useState('');
  const [authedId, setAuthedId] = React.useState('');

  const userInfoEndpoint = '/api/auth/info';

  useEffect(() => {
    // try to get the user info
    axios
      .get(userInfoEndpoint)
      .then(result => {
        setAuthedEmail(result.data.email);
        setAuthedName(result.data.name);
        setAuthedId(result.data.userId);
      })
      .catch(err => {
        console.log('couldnt get user info', err);
      });
  });

  return (
    <UserContext.Provider
      value={{authedEmail, setAuthedEmail, authedName, setAuthedName, authedId}}
    >
      {children}
    </UserContext.Provider>
  );
};

export {useUser, UserProvider};
