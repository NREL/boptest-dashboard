import React, {useEffect} from 'react';
import axios from 'axios';

interface UserContextValue {
  displayName: string;
  setDisplayName: (name: string) => void;
  authedId: string;
  hashedIdentifier: string;
  shareAllResults: string;
  setShareAllResults: (share: string) => void;
  loading: boolean;
  refreshAuthStatus: () => void;
  isAdmin: boolean;
  csrfToken: string | null;
}

export const UserContext = React.createContext<UserContextValue>({
  displayName: '',
  setDisplayName: () => {},
  authedId: '',
  hashedIdentifier: '',
  shareAllResults: '',
  setShareAllResults: () => {},
  loading: true,
  refreshAuthStatus: () => {},
  isAdmin: false,
  csrfToken: null,
});

const useUser = () => React.useContext(UserContext);

type Props = {
  children: React.ReactNode;
};

const UserProvider = ({children}: Props) => {
  const [displayName, setDisplayName] = React.useState('');
  const [authedId, setAuthedId] = React.useState('');
  const [hashedIdentifier, setHashedIdentifier] = React.useState('');
  const [shareAllResults, setShareAllResults] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null);

  const authStatusEndpoint = '/api/auth/status';

  const fetchAuthStatus = () => {
    setLoading(true);

    axios
      .get(authStatusEndpoint, {withCredentials: true})
      .then(result => {
        if (result.data.authenticated && result.data.user) {
          setDisplayName(result.data.user.displayName || '');
          setAuthedId(result.data.user.userId || '');
          setHashedIdentifier(result.data.user.hashedIdentifier || '');
          setShareAllResults(result.data.user.shareAllResults || '');
          setIsAdmin(result.data.user.isAdmin || false);
          setCsrfToken(result.data.csrfToken || null);
        } else {
          setDisplayName('');
          setAuthedId('');
          setHashedIdentifier('');
          setShareAllResults('');
          setIsAdmin(false);
          setCsrfToken(null);
        }
      })
      .catch(err => {
        console.error('Error fetching auth status:', err);
        setDisplayName('');
        setAuthedId('');
        setHashedIdentifier('');
        setShareAllResults('');
        setIsAdmin(false);
        setCsrfToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');

    if (loginSuccess === 'success') {
      fetchAuthStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return (
    <UserContext.Provider
      value={{
        displayName,
        setDisplayName,
        authedId,
        hashedIdentifier,
        shareAllResults,
        setShareAllResults,
        loading,
        refreshAuthStatus: fetchAuthStatus,
        isAdmin,
        csrfToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {useUser, UserProvider};
