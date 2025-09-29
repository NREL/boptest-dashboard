import React from 'react';

export interface MobileHeaderStatus {
  state: 'public' | 'private';
  label: React.ReactNode;
}

export interface MobileHeaderOptions {
  leftAction?: 'menu' | 'back' | 'none';
  onBack?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: MobileHeaderStatus;
  rightExtras?: React.ReactNode;
  hideAuthControl?: boolean;
  leadingIcon?: React.ReactNode;
}

const defaultOptions: MobileHeaderOptions = {};

interface MobileHeaderContextValue {
  options: MobileHeaderOptions;
  setOptions: (options: MobileHeaderOptions) => void;
  reset: () => void;
}

export const MobileHeaderContext = React.createContext<MobileHeaderContextValue>(
  {
    options: defaultOptions,
    setOptions: () => undefined,
    reset: () => undefined,
  }
);

export const useMobileHeader = () => React.useContext(MobileHeaderContext);
