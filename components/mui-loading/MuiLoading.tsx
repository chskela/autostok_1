import React from 'react';
import { useClasses } from './MuiLoading.useClasses';
import styles from './MuiLoading.useStyles.module.css';

import { Clsx } from 'components/core';
import { CircularProgress } from '@material-ui/core';
import { CircularProgressProps } from '@material-ui/core';

import { CSSTransition } from 'react-transition-group';

interface IProps {
  visible?: boolean;
  onExited?: any; duration?: number;
  size?: CircularProgressProps['size'];
  className?: CircularProgressProps['className'];
}

export const MuiLoading = React.memo<IProps>((props) => {
  const classes = useClasses(props);

  const animatedProps = {
    unmountOnExit: true,
    in: props['visible'],
    timeout: {
      enter: props['duration'],
      exit: props['duration'] / 2,
    },
    classNames: {
      exitActive: classes.exitActive, 
      enterActive: classes.enterActive,
    }
  };

  return (
    <CSSTransition {...animatedProps} onExited={()=>props['onExited'] ? props.onExited() : null}>
      <div className={Clsx(styles['mui-loading'], props['className'])}>
          <div className={styles['circular-progress']}>
            <CircularProgress size={props['size'] ? props['size'] : 80} thickness={1}/>
          </div>
      </div>
    </CSSTransition>
  )
})