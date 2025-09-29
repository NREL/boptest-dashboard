import {AppRoute} from '../enums';
import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import {SvgIconProps} from '@material-ui/core/SvgIcon';
import {ElementType} from 'react';

export interface NavLinkConfig {
  label: string;
  path: string;
  Icon: ElementType<SvgIconProps>;
  requiresAuth?: boolean;
}

export const navLinks: NavLinkConfig[] = [
  {
    label: 'Home',
    path: AppRoute.Results,
    Icon: HomeIcon,
  },
  {
    label: 'My Results',
    path: AppRoute.Dashboard,
    Icon: DashboardIcon,
    requiresAuth: true,
  },
  {
    label: 'Account Settings',
    path: AppRoute.Settings,
    Icon: SettingsIcon,
    requiresAuth: true,
  },
];
