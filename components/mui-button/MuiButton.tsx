import React from 'react';
import { useClasses } from './MuiButton.useClasses';
import styles from './MuiButton.useStyles.module.css';

import { Clsx } from '@components/core';
import { MuiSkeleton } from '@components/core';
import { CSSTransition } from 'react-transition-group';
import { Button, ButtonProps } from '@material-ui/core';

interface IProps {
  icon?: any;
  label?: string;
  loading?: boolean;
  /////////////////////////////
  onClick?: ButtonProps['onClick'];
  className?: ButtonProps['className'];
}

export const MuiButton = React.memo<IProps>((props) => {
  const classes = useClasses(props);

  const buttonProps = {
    onClick: (event) => onClick(event),
    disableRipple: true, disableFocusRipple: true,
    className: Clsx(styles['mui-button'], props['className'])
  };

  const onClick = (event) => {
    if(props['onClick']){
      if(!props['loading']){
        props.onClick(event);
      }
    }
  }

  const animatedProps = {
    unmountOnExit: true,
    timeout: {
      exit: 0, 
      enter: 300,
    },
    classNames: {
      exitActive: classes.exitActive, 
      enterActive: classes.enterActive,
    }
  };

  return (
    <Button {...buttonProps}>
      <div className={Clsx(styles['container'], props['loading'] && 'invisible')}>
        <div data-role={'label'}>{props['label']}</div>
        {props['icon'] && <div data-role={'icon'}>{props['icon']}</div>}
      </div>

      <CSSTransition in={props['loading']} {...animatedProps}>
        <div className={styles['container-skeleton']}>
          <MuiSkeleton className={styles['skeleton']}
          />

          <MuiSkeleton className={styles['skeleton']}
          />
        </div>
      </CSSTransition>
    </Button>
  )
})