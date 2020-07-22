import React, {Dispatch, SetStateAction, useEffect} from 'react';

import {Title} from '../enums';

type AboutProps = {
  setTitle: Dispatch<SetStateAction<string>>;
};

export const About: React.FC<AboutProps> = props => {
  useEffect(() => {
    props.setTitle(Title.About);
  });

  return <div>About Page</div>;
};
