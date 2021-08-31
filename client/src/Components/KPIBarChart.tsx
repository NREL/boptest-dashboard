import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {Bullet} from '@nivo/bullet';

const backgroundColor = '#eceff0';
const markerColor = '#078b75';

const useStyles = makeStyles((theme: Theme) =>
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
