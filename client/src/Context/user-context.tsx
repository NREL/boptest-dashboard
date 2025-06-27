import React, {useEffect} from 'react';
import axios from 'axios';

export const UserContext = React.createContext({
  displayName: '',
  setDisplayName: (name: string) => {},
  authedId: '',
  hashedIdentifier: '',
  shareAllResults: '',
  setShareAllResults: (share: string) => {},
  loading: true,
  refreshAuthStatus: () => {},
  isAdmin: false,
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

  // Use the new direct auth status endpoint
  const authStatusEndpoint = '/api/auth/status';

  // Function to get a cookie value by name
  const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };

  // Helper function to delete a cookie
  const deleteCookie = (name: string) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log(`Cookie ${name} deleted`);
  };

  // Check for login success in URL and clean up parameters
  useEffect(() => {
    // Check if we're in the middle of a login flow
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');
    
    if (loginSuccess === 'success') {
      console.log('Login success detected, cleaning up URL parameters');
      // Clean up URL parameters but don't delete cookies
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // NEVER delete cookies here - it's breaking authentication
  }, []);

  // Function to fetch user auth status with improved error handling
  const fetchAuthStatus = () => {
    setLoading(true);
    
    // Try to get user data from auth_user cookie first for faster loading
    try {
      const authUserCookie = getCookie('auth_user');
      
      if (authUserCookie) {
        try {
          // Handle potential encoding of cookie values
          let userData;
          let decodedValue = authUserCookie;
          
          try {
            // First attempt to parse directly
            userData = JSON.parse(decodedValue);
          } catch (e) {
            // If direct parsing fails, try decoding first
            try {
              decodedValue = decodeURIComponent(authUserCookie);
              userData = JSON.parse(decodedValue);
            } catch (decodeError) {
              // If we still can't parse, try another decode (handles double-encoding)
              decodedValue = decodeURIComponent(decodedValue);
              userData = JSON.parse(decodedValue);
            }
          }
          
          if (userData && userData.hashedIdentifier) {
            // Set user context from cookie
            setDisplayName(userData.displayName || '');
            setAuthedId(userData.userId?.toString() || '');
            setHashedIdentifier(userData.hashedIdentifier || '');
            
            // Continue with server call to verify and get complete data
            // but don't block UI waiting for it
            setLoading(false);
          }
        } catch (e) {
          // Silent fail on cookie processing - we'll use the server request
        }
      }
    } catch (cookieError) {
      // Silent fail on cookie access - we'll use the server request
    }
    
    // Always make the server call for definitive auth status
    axios
      .get(authStatusEndpoint, { withCredentials: true })
      .then(result => {
        if (result.data.authenticated && result.data.user) {
          setDisplayName(result.data.user.displayName || '');
          setAuthedId(result.data.user.userId || '');
          setHashedIdentifier(result.data.user.hashedIdentifier || '');
          setShareAllResults(result.data.user.shareAllResults || '');
          setIsAdmin(result.data.user.isAdmin || false);
        } else {
          // Clear state if server says we're not authenticated
          setDisplayName('');
          setAuthedId('');
          setHashedIdentifier('');
          setShareAllResults('');
          setIsAdmin(false);
        }
      })
      .catch(err => {
        // On error, keep any data from cookies but show as no longer loading
        console.error('Error fetching auth status:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Check for login success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');
    
    if (loginSuccess === 'success') {
      console.log('Login success detected in URL, fetching auth status');
      fetchAuthStatus();
      
      // Remove the login parameter from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    fetchAuthStatus();
  }, []); // Added empty dependency array to prevent infinite loop

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {useUser, UserProvider};