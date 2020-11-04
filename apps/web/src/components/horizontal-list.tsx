import { makeStyles } from '@material-ui/core';
import React from 'react';

const useHorizontalListStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
    // We need this padding to make sure that shadows of child components are
    // not cut off
    paddingBottom: 2,
    '& > *': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
      flexShrink: 0,
      '&:first-child': {
        marginLeft: theme.spacing(1)
      },
      '&:last-child': {
        marginRight: theme.spacing(1)
      },
    },
  },
  
}));

export const HorizontalList: React.FC = ({ children }) => {
  const horizontalListClasses = useHorizontalListStyles();

  return (
    <div className={horizontalListClasses.container}>
      {children}
    </div>
  );
};
