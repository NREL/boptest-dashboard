import React from 'react';
import {createStyles, makeStyles, useTheme, Theme} from '@material-ui/core/styles';
import {Bullet} from '@nivo/bullet';

const useStyles = makeStyles(() =>
  createStyles({
    bullet: {
      padding: '16px 8px 16px 8px',
    },
  })
);

interface BarChartProps {
  value: number;
  min: number;
  max: number;
}

export const KPIBarChart: React.FC<BarChartProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  
  // Use theme colors instead of hardcoded values
  const backgroundColor = theme.palette.background.paper;
  const markerColor = theme.palette.primary.main;

  const data = [
    {
      id: '',
      ranges: [props.max],
      measures: [],
      markers: [props.value],
    },
  ];

  return (
    <Bullet
      data={data}
      margin={{top: 8, right: 16, bottom: 20, left: 16}}
      markerSize={1}
      animate={true}
      motionStiffness={90}
      motionDamping={12}
      height={50}
      width={400}
      titleOffsetX={0}
      titleOffsetY={0}
      className={classes.bullet}
      rangeColors={backgroundColor}
      markerColors={markerColor}
      tickValues={5}
      maxValue={props.max}
      minValue={props.min}
    />
  );
};
