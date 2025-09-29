import React, {useEffect, useMemo} from 'react';
import SettingsIcon from '@material-ui/icons/Settings';

import {useMobileHeader} from '../../NavBar/MobileHeaderContext';

export const SettingsMobileHeader: React.FC = () => {
  const {setOptions, reset} = useMobileHeader();
  const settingsIcon = useMemo(() => <SettingsIcon fontSize="small" />, []);

  useEffect(() => {
    setOptions({
      leftAction: 'menu',
      subtitle: 'Account Settings',
      leadingIcon: settingsIcon,
    });

    return () => reset();
  }, [reset, setOptions, settingsIcon]);

  return null;
};
