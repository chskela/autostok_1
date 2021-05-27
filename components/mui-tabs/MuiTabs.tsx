import React from 'react';
import styles from './MuiTabs.useStyles.module.css';

import { Clsx } from '@components/core';
import { Tab, TabProps } from '@material-ui/core';
import { Tabs, TabsProps } from '@material-ui/core';

export const MuiTab = React.memo<TabProps>((props) => {
  return (
    <Tab {...props} className={Clsx(styles['mui-tab'], props['className'])}/>
  )
})

interface MuiTabsProps extends TabsProps{onChange?: any};
export const MuiTabs = React.memo<MuiTabsProps>((props) => {
  return (
    <Tabs {...props} className={Clsx(styles['mui-tabs'], props['className'])}/>
  )
})