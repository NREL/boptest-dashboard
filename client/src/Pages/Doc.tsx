import React from 'react';
import ReactMarkdown from 'react-markdown';
import {useLocation} from 'react-router-dom';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {BuildingType} from '../../common/interfaces';

interface LocationState {
  pathname: string;
  buildingType: BuildingType;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '16px',
    },
  })
);

export const Doc: React.FC = () => {
  const classes = useStyles();

  const location = useLocation<LocationState>();
  const {buildingType} = location.state;

  return (
    <div className={classes.root}>
      <Typography variant="h3">{buildingType.name}</Typography>
      <ReactMarkdown source={buildingType.markdown} escapeHtml={false} />
      <Typography variant="h5">
        <a target="_blank" href={buildingType.pdfURL}>
          Download PDF
        </a>
      </Typography>
    </div>
  );
};
