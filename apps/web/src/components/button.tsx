import React from 'react';
import {
  makeStyles,
  Button as MuiButton,
  ButtonProps,
} from '@material-ui/core';

const useButtonStyle = makeStyles(() => ({
  root: {
    borderRadius: 50,
  },
}));

/**
 * Update the button component to always have fully rounded ends
 */
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  const buttonClasses = useButtonStyle();

  return (
    <MuiButton classes={buttonClasses} {...props}>
      {children}
    </MuiButton>
  );
};
