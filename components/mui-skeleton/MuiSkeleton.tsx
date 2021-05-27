import React from 'react';
import styles from './MuiSkeleton.useStyles.module.css';

import { Clsx } from 'components/core'; 
import { Skeleton, SkeletonProps } from '@material-ui/lab';

export const MuiSkeleton = React.memo<SkeletonProps>((props) => {  
  return (
    <Skeleton animation={'wave'} variant={'rect'} {...props}
      className={Clsx(styles['mui-skeleton'], props['className'])}
    />
  )
})