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

const assignGlobalShareSetting = (setter, value) => {
  let setting = '';
  if (value === true) {
    setting = 'yes';
  } else if (value === false) {
    setting = 'no';
  } else {
    setting = 'default';
  }
  setter(setting);
};

const UserProvider = ({children}: Props) => {
  const [authedEmail, setAuthedEmail] = React.useState('');
  const [authedName, setAuthedName] = React.useState('');
  const [authedId, setAuthedId] = React.useState('');
  const [globalShareSetting, setGlobalShareSetting] = React.useState('');

  const userInfoEndpoint = '/api/accounts/info';

  useEffect(() => {
    // try to get the user info
    axios
      .get(userInfoEndpoint)
      .then(result => {
        setAuthedEmail(result.data.email);
        setAuthedName(result.data.name);
        setAuthedId(result.data.userId);
        assignGlobalShareSetting(
          setGlobalShareSetting,
          result.data.globalShare
        );
      })
      .catch(err => {
        console.log('couldnt get user info', err); // TODO
      });
  });

  return (
    <UserContext.Provider
      value={{
        authedEmail,
        setAuthedEmail,
        authedName,
        setAuthedName,
        authedId,
        globalShareSetting,
        setGlobalShareSetting,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {useUser, UserProvider};
