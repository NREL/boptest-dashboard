import React from 'react';

import {Grid} from '@material-ui/core';

import './navbar.css';

export const NavBar: React.FC = () => {
  return (
    <div className="navbar">
      <Grid container className="navbar-grid">
        <Grid item className="navbar-selection">
          <div>NavBar</div>
        </Grid>
      </Grid>
    </div>
  );
};
