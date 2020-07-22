import React, {Dispatch, SetStateAction, useEffect} from 'react';

import {Title} from '../enums';

type DocsProps = {
  setTitle: Dispatch<SetStateAction<string>>;
};

export const Docs: React.FC<DocsProps> = props => {
  useEffect(() => {
    props.setTitle(Title.Docs);
  });

  return <div>Docs Page</div>;
};
