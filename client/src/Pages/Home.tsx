import React, {Dispatch, SetStateAction, useEffect} from 'react';

import {Title} from '../enums';
import './home.css';

type HomeProps = {
  setTitle: Dispatch<SetStateAction<string>>;
};

export const Home: React.FC<HomeProps> = props => {
  useEffect(() => {
    props.setTitle(Title.Home);
  });
  return (
    <div className="home-container">
      <div className="b1"> I'm a block </div>
      <div className="b2"> I'm also a block</div>
    </div>
  );
};
