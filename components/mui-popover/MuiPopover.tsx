import React from 'react';
import styles from './MuiPopover.useStyles.module.css';

import { Clsx } from '@components/core';
import { Popover, PopoverProps } from '@material-ui/core';

export const MuiPopover = React.memo<PopoverProps>((props) => {
  const open: any = props['open'];
  return (
    <Popover {...props} open={Boolean(open)} anchorEl={open}
      className={Clsx(styles['mui-popover'], props['className'])}
    />
  )
})