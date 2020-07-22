import React, {Dispatch, SetStateAction, useEffect} from 'react';

import {Title} from '../enums';

type AccountProps = {
  setTitle: Dispatch<SetStateAction<string>>;
};

export const Account: React.FC<AccountProps> = props => {
  useEffect(() => {
    props.setTitle(Title.Account);
  });

  return <div>Account Page</div>;
};
